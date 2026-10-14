import { DemoHost } from '@/components/DemoHost';
import { validateAndSanitizeUI } from '@/lib/validation/uiValidator';

/**
 * In production this payload arrives from a CMS, a feature-flag service, or an
 * AI agent API. It is untrusted input — validation here is mandatory, not
 * optional.
 *
 * React Server Component boundary: Zod parsing, sanitization, and
 * id-stabilization all execute on the server. Only the validated JSON crosses
 * into the client bundle; Zod itself never ships to the browser.
 */
const rawSchemaPayload: unknown = {
  version: '1.0.0',
  meta: { title: 'FlinchUI showcase', locale: 'en-US' },
  root: {
    id: 'page-root',
    type: 'Container',
    display: 'flex',
    direction: 'column',
    gap: 'lg',
    className: 'w-full',
    children: [
      {
        id: 'hero-card',
        type: 'Card',
        variant: 'elevated',
        padding: 'lg',
        radius: 'xl',
        children: [
          {
            id: 'hero-heading',
            type: 'Heading',
            level: 1,
            text: 'Config-driven UI, rendered at the edge.',
          },
          {
            id: 'hero-subheading',
            type: 'Heading',
            level: 3,
            text: 'Everything below was described by JSON, validated by Zod on the server, and code-split on demand.',
            className: 'text-slate-600 dark:text-slate-300',
          },
        ],
      },
      {
        id: 'cta-row',
        type: 'Container',
        display: 'flex',
        direction: 'row',
        gap: 'md',
        align: 'center',
        children: [
          {
            id: 'cta-primary',
            type: 'Button',
            actionId: 'subscribe.start',
            label: 'Start free trial',
            variant: 'primary',
            size: 'lg',
            payload: { plan: 'pro', source: 'hero' },
          },
          {
            id: 'cta-secondary',
            type: 'Button',
            actionId: 'tour.start',
            label: 'Watch the tour',
            variant: 'outline',
          },
          {
            id: 'cta-muted',
            type: 'Button',
            actionId: 'docs.open',
            label: 'Read the docs',
            variant: 'ghost',
            disabled: true,
          },
        ],
      },
      {
        id: 'signup-card',
        type: 'Card',
        variant: 'outlined',
        padding: 'md',
        children: [
          {
            id: 'signup-heading',
            type: 'Heading',
            level: 2,
            text: 'Create your workspace',
          },
          {
            id: 'signup-form',
            type: 'Container',
            display: 'grid',
            columns: 2,
            gap: 'md',
            className: 'max-md:grid-cols-1',
            children: [
              {
                id: 'email-field',
                type: 'Input',
                name: 'email',
                label: 'Work email',
                kind: 'email',
                placeholder: 'you@company.com',
                required: true,
                actionId: 'signup.email.change',
                constraints: { maxLength: 320 },
              },
              {
                id: 'company-field',
                type: 'Input',
                name: 'company',
                label: 'Company',
                placeholder: 'Acme Inc.',
                actionId: 'signup.company.change',
              },
              {
                id: 'password-field',
                type: 'Input',
                name: 'password',
                label: 'Password',
                kind: 'password',
                required: true,
                helperText: 'Minimum 8 characters.',
                actionId: 'signup.password.change',
                constraints: { minLength: 8 },
              },
              {
                id: 'seats-field',
                type: 'Input',
                name: 'seats',
                label: 'Team seats',
                kind: 'number',
                defaultValue: '5',
                constraints: { min: 1, max: 999 },
                actionId: 'signup.seats.change',
              },
            ],
          },
        ],
      },
    ],
  },
};

export default function HomePage() {
  // Server-side trust boundary: malformed agent payloads return null here and
  // never reach the rendering tree.
  const schema = validateAndSanitizeUI(rawSchemaPayload);

  if (schema === null) {
    return (
      <main className="mx-auto max-w-4xl p-8">
        <h1 className="text-2xl font-bold text-red-600">Invalid UI configuration</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          The requested layout failed schema validation and was refused for rendering.
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl p-8">
      <DemoHost schema={schema} />
    </main>
  );
}
