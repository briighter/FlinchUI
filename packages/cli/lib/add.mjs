import path from 'node:path';
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { ui } from './ui.mjs';
import { findComponent } from './registry.mjs';
import {
  cliVersion,
  installedDependencies,
  installDependencies,
  readComponentsJson,
  writeComponentsJson,
} from './project.mjs';

const SOURCE_EXTENSIONS = ['.tsx', '.ts', '.jsx', '.js', '.css', '/index.tsx', '/index.ts'];
const BUILT_IN = new Set(['react', 'react-dom', 'react/jsx-runtime', 'next']);

/** `@scope/pkg/sub` → `@scope/pkg`; `pkg/sub` → `pkg`. */
export function packageName(specifier) {
  const parts = specifier.split('/');
  if (specifier.startsWith('@')) return parts.slice(0, 2).join('/');
  return parts[0];
}

/**
 * Walks imports from the requested entry files and returns every local file
 * that must be copied, plus the bare packages those files reference.
 */
export function collectFiles(sourceRoot, entryFiles) {
  const files = new Set();
  const dependencies = new Set();
  const queue = [...entryFiles];

  while (queue.length > 0) {
    const candidate = queue.shift();
    const absolute = path.isAbsolute(candidate) ? candidate : path.join(sourceRoot, candidate);

    if (!existsSync(absolute) || files.has(absolute)) continue;

    // Never copy anything outside the library's `src` tree.
    const relative = path.relative(path.join(sourceRoot, 'src'), absolute);
    if (relative.startsWith('..') || path.isAbsolute(relative)) continue;

    files.add(absolute);

    const source = readFileSync(absolute, 'utf8');
    for (const specifier of readSpecifiers(source)) {
      if (specifier.startsWith('.')) {
        const resolved = resolveFile(path.resolve(path.dirname(absolute), specifier));
        if (resolved) queue.push(resolved);
        continue;
      }

      if (specifier.startsWith('@/')) {
        const resolved = resolveFile(path.join(sourceRoot, 'src', specifier.slice(2)));
        if (resolved) queue.push(resolved);
        continue;
      }

      if (specifier.startsWith('node:')) continue;
      const name = packageName(specifier);
      if (!BUILT_IN.has(name)) dependencies.add(name);
    }
  }

  return { files: [...files].sort(), dependencies: [...dependencies].sort() };
}

function readSpecifiers(source) {
  const specifiers = new Set();
  const patterns = [
    /\bfrom\s+['"]([^'"]+)['"]/g,
    /\bimport\s+['"]([^'"]+)['"]/g,
    /\bimport\(\s*['"]([^'"]+)['"]\s*\)/g,
  ];

  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(source)) !== null) {
      specifiers.add(match[1]);
    }
  }

  return specifiers;
}

function resolveFile(base) {
  if (existsSync(base) && !isDirectory(base)) return base;

  for (const extension of SOURCE_EXTENSIONS) {
    const candidate = `${base}${extension}`;
    if (existsSync(candidate) && !isDirectory(candidate)) return candidate;
  }

  return null;
}

function isDirectory(target) {
  try {
    return statSync(target).isDirectory();
  } catch {
    return false;
  }
}

/**
 * `flinchui add <slug...>` — copies components and their import graph into the
 * consumer project.
 */
export async function add(slugs, registry, options) {
  const { cwd, overwrite = false, dryRun = false, noInstall = false } = options;
  const selected = [];

  for (const slug of slugs) {
    const component = findComponent(registry, slug);
    if (!component) {
      const known = registry.components.map((entry) => entry.slug).join(', ');
      throw new Error(`Unknown component "${slug}".\n  Available: ${known}`);
    }
    selected.push(component);
  }

  const entryFiles = selected.flatMap((component) => component.files ?? []);
  if (entryFiles.length === 0) {
    throw new Error(`No files are declared for: ${selected.map((entry) => entry.slug).join(', ')}`);
  }

  const { files, dependencies } = collectFiles(registry.sourceRoot, entryFiles);
  const plan = files.map((absolute) => ({
    absolute,
    relative: path.relative(registry.sourceRoot, absolute),
  }));

  if (dryRun) {
    process.stdout.write(`\n${ui.bold('Planned files')}\n`);
    for (const entry of plan) {
      const target = path.join(cwd, entry.relative);
      const state = existsSync(target) ? ui.yellow('skip (exists)') : ui.green('create');
      process.stdout.write(`  ${ui.arrow(entry.relative)}  ${state}\n`);
    }
    if (dependencies.length > 0) {
      process.stdout.write(`\n${ui.bold('Dependencies')} ${dependencies.join(', ')}\n`);
    }
    process.stdout.write(`\n${ui.dim('Dry run: nothing was written.')}\n`);
    return;
  }

  const written = [];
  const skipped = [];

  for (const entry of plan) {
    const target = path.join(cwd, entry.relative);
    const exists = existsSync(target);

    if (exists && !overwrite) {
      skipped.push(entry.relative);
      continue;
    }

    if (exists) {
      const current = readFileSync(target, 'utf8');
      const incoming = readFileSync(entry.absolute, 'utf8');
      if (current === incoming) {
        skipped.push(entry.relative);
        continue;
      }
    }

    mkdirSync(path.dirname(target), { recursive: true });
    writeFileSync(target, readFileSync(entry.absolute));
    written.push(entry.relative);
  }

  const componentsJson = readComponentsJson(cwd);
  for (const component of selected) {
    componentsJson.installed[component.slug] = {
      version: cliVersion(),
      files: component.files ?? [],
    };
  }
  writeComponentsJson(cwd, componentsJson);

  process.stdout.write('\n');
  for (const file of written) process.stdout.write(`  ${ui.check(`copied  ${file}`)}\n`);
  for (const file of skipped) process.stdout.write(`  ${ui.dim(`skipped ${file} (exists)`)}\n`);

  const missing = dependencies.filter((dependency) => !installedDependencies(cwd).has(dependency));
  if (missing.length > 0) {
    if (noInstall) {
      process.stdout.write(
        `\n${ui.yellow('Dependencies not installed:')} ${missing.join(', ')}\n` +
          `  Run your package manager to install them.\n`,
      );
    } else {
      process.stdout.write(`\n${ui.dim(`Installing ${missing.join(', ')}…`)}\n`);
      installDependencies(cwd, missing);
    }
  }

  process.stdout.write(
    `\n${ui.green('Done.')} ${selected.length} component${selected.length === 1 ? '' : 's'} ready in ${cwd}\n\n`,
  );
}
