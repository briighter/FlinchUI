import path from 'node:path';
import { loadRegistry } from './registry.mjs';
import { add } from './add.mjs';
import { init } from './init.mjs';
import { list, info } from './list.mjs';
import { cliVersion } from './project.mjs';
import { ui } from './ui.mjs';

const VALUE_FLAGS = new Set(['cwd', 'category']);

function parseArgs(argv) {
  const flags = {};
  const positionals = [];

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];

    if (token === '--') {
      positionals.push(...argv.slice(index + 1));
      break;
    }

    if (token.startsWith('--')) {
      const [rawName, inlineValue] = token.slice(2).split('=');
      const name = rawName;
      if (VALUE_FLAGS.has(name)) {
        const value = inlineValue ?? argv[index + 1];
        if (value === undefined || value.startsWith('--')) {
          throw new Error(`--${name} needs a value.`);
        }
        flags[name] = value;
        if (inlineValue === undefined) index += 1;
      } else {
        flags[name] = inlineValue === undefined ? true : inlineValue;
      }
      continue;
    }

    if (token.startsWith('-') && token !== '-') {
      flags[token.slice(1)] = true;
      continue;
    }

    positionals.push(token);
  }

  return { flags, positionals };
}

function help() {
  process.stdout.write(`
${ui.bold('FlinchUI')} ${ui.dim(`v${cliVersion()}`)}
Copy-paste React components built on Tailwind v4 design tokens.

${ui.bold('Usage')}
  npx flinchui <command> [options]

${ui.bold('Commands')}
  ${ui.cyan('add')} <slug...>       Copy components and their imports into your project
  ${ui.cyan('list')}                List every component in the registry
  ${ui.cyan('info')} <slug>         Show files, dependencies, and props for one component
  ${ui.cyan('init')}                Copy the token layer and shared helpers

${ui.bold('Options')}
  --overwrite          Replace files that already exist
  --dry-run            Show the plan without writing files
  --no-install         Copy files but do not install dependencies
  --cwd <dir>          Target a different project root
  --category <id>      Filter \`list\` by category
  --json               Machine-readable output (list)
  --all                Add every component (with \`add\`)
  --yes                Skip prompts (currently unused, accepted for CI)
  -v, --version        Print the version
  -h, --help           Print this message

${ui.bold('Examples')}
  npx flinchui add button
  npx flinchui add dialog drawer toast --overwrite
  npx flinchui list --category overlays
  npx flinchui add button --dry-run
`);
}

export async function main(argv) {
  const { flags, positionals } = parseArgs(argv);

  if (flags.version || flags.v) {
    process.stdout.write(`${cliVersion()}\n`);
    return;
  }

  const [command, ...rest] = positionals;

  if (flags.help || flags.h || !command || command === 'help') {
    help();
    return;
  }

  const cwd = flags.cwd ? path.resolve(flags.cwd) : process.cwd();
  const options = {
    cwd,
    overwrite: Boolean(flags.overwrite),
    dryRun: Boolean(flags['dry-run']),
    noInstall: Boolean(flags['no-install']),
    category: typeof flags.category === 'string' ? flags.category : undefined,
    json: Boolean(flags.json),
  };

  const registry = await loadRegistry();

  if (command === 'add') {
    let slugs = rest;

    if (flags.all) {
      slugs = registry.components.map((component) => component.slug);
    }

    if (slugs.length === 0) {
      throw new Error('Name at least one component: npx flinchui add button');
    }

    await add(slugs, registry, options);
    return;
  }

  if (command === 'list') {
    list(registry, options);
    return;
  }

  if (command === 'info') {
    const [slug] = rest;
    if (!slug) throw new Error('Usage: npx flinchui info <slug>');
    info(registry, slug);
    return;
  }

  if (command === 'init') {
    init(registry, options);
    return;
  }

  throw new Error(`Unknown command "${command}". Run \`npx flinchui help\`.`);
}
