import path from 'node:path';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { ui } from './ui.mjs';
import { readComponentsJson, writeComponentsJson } from './project.mjs';

const FOUNDATION = [
  'src/lib/cn.ts',
  'src/lib/variants.ts',
  'src/lib/slot.tsx',
  'src/lib/hooks/use-controllable-state.ts',
  'src/styles/tokens.css',
  'src/styles/themes.css',
];

/**
 * `flinchui init` — copies the shared foundation (helpers, tokens, themes) and
 * creates components.json. Idempotent: existing files are left alone unless
 * `--overwrite` is passed.
 */
export function init(registry, options) {
  const { cwd, overwrite = false } = options;

  if (!registry.sourceRoot) {
    throw new Error('Could not locate the FlinchUI source directory.');
  }

  const written = [];
  const skipped = [];

  for (const relative of FOUNDATION) {
    const source = path.join(registry.sourceRoot, relative);
    if (!existsSync(source)) continue;

    const target = path.join(cwd, relative);
    if (existsSync(target) && !overwrite) {
      skipped.push(relative);
      continue;
    }

    mkdirSync(path.dirname(target), { recursive: true });
    writeFileSync(target, readFileSync(source));
    written.push(relative);
  }

  const componentsJson = readComponentsJson(cwd);
  writeComponentsJson(cwd, componentsJson);

  process.stdout.write('\n');
  for (const file of written) process.stdout.write(`  ${ui.check(`copied  ${file}`)}\n`);
  for (const file of skipped) process.stdout.write(`  ${ui.dim(`skipped ${file} (exists)`)}\n`);
  process.stdout.write(`  ${ui.check('updated components.json')}\n`);

  process.stdout.write(
    `\n${ui.bold('Next:')} import the token layer once, before any other styles.\n` +
      `\n  ${ui.cyan('@import "@/styles/tokens.css";')}\n\n`,
  );
}
