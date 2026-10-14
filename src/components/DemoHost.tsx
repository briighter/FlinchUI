'use client';

import { useCallback, useState } from 'react';
import { ConfigRenderer } from '@/components/config-ui/ConfigRenderer';
import type { ActionEvent, PageLayoutSchema } from '@/types/configUI';

const MAX_LOGGED_EVENTS = 10;

/**
 * Client-side host shell. The validated schema arrives as plain serialized
 * JSON from the React Server Component above — only the clean, parsed data
 * crosses the client boundary. This is where the host application wires the
 * declarative `actionId` pipeline into its own event bus / state management.
 */
export function DemoHost({ schema }: { schema: PageLayoutSchema }) {
  const [events, setEvents] = useState<ActionEvent[]>([]);

  const handleAction = useCallback((event: ActionEvent) => {
    // eslint-disable-next-line no-console
    console.info('[config-ui] action dispatched →', event);
    setEvents((previous) => [...previous.slice(-(MAX_LOGGED_EVENTS - 1)), event]);
  }, []);

  return (
    <div className="space-y-10">
      <ConfigRenderer schema={schema} onAction={handleAction} />

      <section
        aria-label="Action event log"
        className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
      >
        <h2 className="text-sm font-semibold tracking-wide text-slate-500 uppercase dark:text-slate-400">
          Action event log
        </h2>
        {events.length === 0 ? (
          <p className="mt-2 text-sm text-slate-400 dark:text-slate-500">
            Interact with the rendered schema to see dispatched actions.
          </p>
        ) : (
          <ul className="mt-3 space-y-2 font-mono text-xs">
            {events.map((event, index) => (
              <li
                key={`${event.nodeId}-${event.timestamp}-${index}`}
                className="rounded bg-slate-100 p-2 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
              >
                <span className="font-semibold text-slate-800 dark:text-slate-100">
                  {event.actionId}
                </span>
                <span className="text-slate-400 dark:text-slate-500">
                  {' '}
                  · {event.event} · node {event.nodeId}
                </span>
                {event.value !== undefined && (
                  <span className="break-all text-slate-500 dark:text-slate-400">
                    {' '}
                    · value=&quot;{event.value}&quot;
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default DemoHost;
