import path from 'node:path';
import { existsSync } from 'node:fs';

/** Root of the installed CLI package (`packages/cli`). */
export const packageRoot = path.resolve(import.meta.dirname, '..');

const useColor =
  process.stdout.isTTY && !process.env.NO_COLOR && process.env.TERM !== 'dumb';

function paint(code, text) {
  return useColor ? `\u001b[${code}m${text}\u001b[0m` : text;
}

export const ui = {
  dim: (text) => paint('2', text),
  bold: (text) => paint('1', text),
  green: (text) => paint('32', text),
  yellow: (text) => paint('33', text),
  cyan: (text) => paint('36', text),
  red: (text) => paint('31', text),
  check: (text) => `${paint('32', '✓')} ${text}`,
  arrow: (text) => `${paint('36', '›')} ${text}`,
};

/**
 * The repository that contains the component source. When the CLI is used
 * inside the FlinchUI repo this is the repo itself; in a consumer project it is
 * wherever the CLI package was checked out.
 */
export function findSourceRoot() {
  if (process.env.FLINCHUI_SOURCE) {
    return path.resolve(process.env.FLINCHUI_SOURCE);
  }

  let dir = packageRoot;
  for (let depth = 0; depth < 6; depth += 1) {
    if (existsSync(path.join(dir, 'src', 'registry', 'components.ts'))) {
      return dir;
    }
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }

  return null;
}
