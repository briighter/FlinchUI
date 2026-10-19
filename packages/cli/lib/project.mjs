import path from 'node:path';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { packageRoot } from './ui.mjs';

export function cliVersion() {
  return readJson(path.join(packageRoot, 'package.json'), { version: '0.0.0' }).version;
}

export const DEFAULT_COMPONENTS_JSON = {
  registry: 'https://flinchui.dev/api/registry',
  aliases: {
    components: '@/components/ui',
    lib: '@/lib',
    styles: '@/styles',
  },
  installed: {},
};

export function readJson(file, fallback = null) {
  if (!existsSync(file)) return fallback;
  try {
    return JSON.parse(readFileSync(file, 'utf8'));
  } catch {
    return fallback;
  }
}

export function writeJson(file, data) {
  writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

export function readComponentsJson(cwd) {
  return readJson(path.join(cwd, 'components.json'), { ...DEFAULT_COMPONENTS_JSON });
}

export function writeComponentsJson(cwd, data) {
  writeJson(path.join(cwd, 'components.json'), data);
}

export function detectPackageManager(cwd) {
  if (existsSync(path.join(cwd, 'pnpm-lock.yaml'))) return 'pnpm';
  if (existsSync(path.join(cwd, 'yarn.lock'))) return 'yarn';
  if (existsSync(path.join(cwd, 'bun.lockb')) || existsSync(path.join(cwd, 'bun.lock'))) return 'bun';
  return 'npm';
}

export function installedDependencies(cwd) {
  const pkg = readJson(path.join(cwd, 'package.json'), {});
  return new Set([
    ...Object.keys(pkg.dependencies ?? {}),
    ...Object.keys(pkg.devDependencies ?? {}),
  ]);
}

/** Installs the given package names with the project's package manager. */
export function installDependencies(cwd, packages) {
  if (packages.length === 0) return;

  const manager = detectPackageManager(cwd);
  const args = manager === 'npm' ? ['install', ...packages] : ['add', ...packages];

  execFileSync(manager, args, { cwd, stdio: 'inherit' });
}
