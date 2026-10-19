import path from 'node:path';
import vm from 'node:vm';
import { existsSync, readFileSync } from 'node:fs';
import { findSourceRoot, packageRoot } from './ui.mjs';

/**
 * Loads the component registry.
 *
 * Inside the FlinchUI repository the TypeScript source is the single source of
 * truth, so the CLI transpiles and evaluates it directly (types are erased, and
 * the module has no runtime imports). Published copies of the CLI fall back to
 * the generated `registry.json` beside this file.
 */
export async function loadRegistry() {
  const sourceRoot = findSourceRoot();
  const tsFile = sourceRoot && path.join(sourceRoot, 'src', 'registry', 'components.ts');

  if (tsFile && existsSync(tsFile)) {
    try {
      const registry = await readTypeScriptRegistry(tsFile);
      return { ...registry, sourceRoot, source: 'typescript' };
    } catch {
      // Fall through to the generated JSON copy.
    }
  }

  const jsonFile = path.join(packageRoot, 'registry.json');
  if (existsSync(jsonFile)) {
    const data = JSON.parse(readFileSync(jsonFile, 'utf8'));
    return {
      components: data.components,
      categories: data.categories,
      sourceRoot,
      source: 'json',
    };
  }

  throw new Error(
    'Could not find the FlinchUI registry. Expected src/registry/components.ts or packages/cli/registry.json.',
  );
}

async function readTypeScriptRegistry(file) {
  const ts = await import('typescript');
  const source = readFileSync(file, 'utf8');
  const output = ts.default.transpileModule(source, {
    compilerOptions: {
      module: ts.default.ModuleKind.CommonJS,
      target: ts.default.ScriptTarget.ES2022,
    },
    fileName: file,
  }).outputText;

  const module = { exports: {} };
  const sandbox = { module, exports: module.exports };
  vm.runInNewContext(output, sandbox, { filename: file });
  const exported = sandbox.module.exports;

  if (!Array.isArray(exported.components) || !Array.isArray(exported.categories)) {
    throw new Error('Registry module did not export components and categories.');
  }

  return { components: exported.components, categories: exported.categories };
}

export function findComponent(registry, slug) {
  return registry.components.find((component) => component.slug === slug);
}

export function categoryLabel(registry, id) {
  return registry.categories.find((category) => category.id === id)?.label ?? id;
}
