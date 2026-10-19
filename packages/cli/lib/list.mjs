import { ui } from './ui.mjs';
import { categoryLabel } from './registry.mjs';

/** `flinchui list [--category <id>] [--json]` */
export function list(registry, options) {
  let components = registry.components;

  if (options.category) {
    components = components.filter((component) => component.category === options.category);
    if (components.length === 0) {
      throw new Error(
        `No components in "${options.category}". Categories: ${registry.categories
          .map((category) => category.id)
          .join(', ')}`,
      );
    }
  }

  if (options.json) {
    process.stdout.write(
      `${JSON.stringify(
        components.map((component) => ({
          slug: component.slug,
          name: component.name,
          category: component.category,
          description: component.description,
          status: component.status ?? 'stable',
          deps: component.deps ?? [],
        })),
        null,
        2,
      )}\n`,
    );
    return;
  }

  const groups = new Map();
  for (const component of components) {
    const key = component.category;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(component);
  }

  process.stdout.write(`\n${ui.bold(`FlinchUI · ${components.length} components`)}\n`);

  for (const category of registry.categories) {
    const entries = groups.get(category.id);
    if (!entries) continue;

    process.stdout.write(`\n${ui.bold(category.label)}\n`);
    const width = Math.max(...entries.map((entry) => entry.slug.length));
    for (const entry of entries) {
      const beta = entry.status === 'beta' ? ui.yellow(' (beta)') : '';
      const deps = entry.deps?.length ? ui.dim(` · needs ${entry.deps.join(', ')}`) : '';
      process.stdout.write(
        `  ${ui.cyan(entry.slug.padEnd(width))}  ${entry.description}${beta}${deps}\n`,
      );
    }
  }

  process.stdout.write(`\n${ui.dim('Add one with: npx flinchui add <slug>')}\n\n`);
}

/** `flinchui info <slug>` */
export function info(registry, slug) {
  const component = registry.components.find((entry) => entry.slug === slug);
  if (!component) throw new Error(`Unknown component "${slug}". Run \`flinchui list\`.`);

  process.stdout.write(`\n${ui.bold(component.name)} ${ui.dim(`(${component.slug})`)}\n`);
  process.stdout.write(`${component.description}\n\n`);
  process.stdout.write(`${ui.dim('Category')}     ${categoryLabel(registry, component.category)}\n`);
  process.stdout.write(`${ui.dim('Status')}       ${component.status ?? 'stable'}\n`);

  if (component.files?.length) {
    process.stdout.write(`${ui.dim('Files')}        ${component.files.join(', ')}\n`);
  }
  if (component.deps?.length) {
    process.stdout.write(`${ui.dim('Dependencies')} ${component.deps.join(', ')}\n`);
  }
  if (component.props?.length) {
    process.stdout.write(`\n${ui.bold('Props')}\n`);
    for (const prop of component.props) {
      const required = prop.required ? ui.yellow(' required') : '';
      const fallback = prop.default ? ui.dim(` = ${prop.default}`) : '';
      process.stdout.write(`  ${ui.cyan(prop.name)}${required}${fallback}\n    ${prop.description}\n`);
    }
  }
  if (component.related?.length) {
    process.stdout.write(`\n${ui.dim('Related')} ${component.related.join(', ')}\n`);
  }

  process.stdout.write(`\n${ui.dim('Install:')} npx flinchui add ${component.slug}\n\n`);
}
