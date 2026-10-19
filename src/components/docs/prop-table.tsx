import type { PropDoc } from '@/lib/registry';
import { Code } from '@/components/ui/code';

export interface PropTableProps {
  props: PropDoc[];
  /** Caption shown above the table. */
  title?: string;
}

/** PropTable — the API reference table rendered from registry metadata. */
export function PropTable({ props, title = 'Props' }: PropTableProps) {
  if (props.length === 0) return null;

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-base font-semibold text-fg">{title}</h3>
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-surface-sunken/70">
            <tr>
              <th scope="col" className="px-4 py-2.5 text-left text-xs font-semibold tracking-wide text-fg-muted uppercase">
                Prop
              </th>
              <th scope="col" className="px-4 py-2.5 text-left text-xs font-semibold tracking-wide text-fg-muted uppercase">
                Type
              </th>
              <th scope="col" className="px-4 py-2.5 text-left text-xs font-semibold tracking-wide text-fg-muted uppercase">
                Default
              </th>
              <th scope="col" className="px-4 py-2.5 text-left text-xs font-semibold tracking-wide text-fg-muted uppercase">
                Description
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {props.map((prop) => (
              <tr key={prop.name} className="align-top">
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className="font-mono text-[13px] font-medium text-fg">{prop.name}</span>
                  {prop.required ? <span className="ml-1 text-danger">*</span> : null}
                </td>
                <td className="px-4 py-3">
                  <Code className="text-[12px]">{prop.type}</Code>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {prop.default ? (
                    <Code className="text-[12px]">{prop.default}</Code>
                  ) : (
                    <span className="text-fg-subtle">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-fg-muted">{prop.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-fg-subtle">
        <span className="text-danger">*</span> Required. Every component also forwards the native props of
        its underlying element, including <Code>className</Code>, <Code>id</Code>, and event handlers.
      </p>
    </div>
  );
}
