#!/usr/bin/env node
/**
 * Generates packages/cli/registry.json from src/registry/components.ts.
 *
 * The CLI reads the TypeScript source directly when it runs inside this repo;
 * this file exists so a copied/published CLI still has a registry to fall back
 * to. Run `npm run registry` after changing the registry.
 */
import path from 'node:path';
import vm from 'node:vm';
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, '..', '..', '..');
const sourceFile = path.join(repoRoot, 'src', 'registry', 'components.ts');

const source = readFileSync(sourceFile, 'utf8');
const output = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2022,
  },
  fileName: sourceFile,
}).outputText;

const module = { exports: {} };
const sandbox = { module, exports: module.exports };
vm.runInNewContext(output, sandbox, { filename: sourceFile });

const { components, categories } = sandbox.module.exports;

const payload = {
  $comment: 'Generated from src/registry/components.ts. Run `npm run registry` to refresh.',
  version: JSON.parse(readFileSync(path.join(repoRoot, 'package.json'), 'utf8')).version,
  generatedAt: new Date().toISOString(),
  categories,
  components,
};

writeFileSync(
  path.join(here, '..', 'registry.json'),
  `${JSON.stringify(payload, null, 2)}\n`,
  'utf8',
);

process.stdout.write(
  `Wrote packages/cli/registry.json (${components.length} components, ${categories.length} categories).\n`,
);
