import { Alert } from '@/components/ui/alert';
import { VStack } from '@/components/ui/stack';
import { Example, ExampleGroup } from '@/components/docs/example';
import { ToastDemo, ToastDurationDemo, AlertDismissDemo } from '@/content/demos';

export function FeedbackDocs({ slug }: { slug: string }) {
  if (slug === 'alert') {
    return (
      <ExampleGroup>
        <Example
          title="Tones"
          description="Five tones map to the semantic status colors, each with a matching icon."
          code={`<Alert tone="info" title="Heads up">A new version is available.</Alert>
<Alert tone="success" title="Deployment complete">Production is healthy.</Alert>
<Alert tone="warning" title="Usage limit">You have used 90% of your quota.</Alert>
<Alert tone="danger" title="Payment failed">Update your card to restore access.</Alert>
<Alert tone="neutral" title="Scheduled maintenance">Sunday, 02:00–03:00 UTC.</Alert>`}
        >
          <VStack gap="md">
            <Alert tone="info" title="Heads up">
              A new version is available.
            </Alert>
            <Alert tone="success" title="Deployment complete">
              Production is healthy and serving the latest build.
            </Alert>
            <Alert tone="warning" title="Usage limit">
              You have used 90% of your monthly quota.
            </Alert>
            <Alert tone="danger" title="Payment failed">
              Update your card to restore access.
            </Alert>
            <Alert tone="neutral" title="Scheduled maintenance">
              Sunday, 02:00–03:00 UTC.
            </Alert>
          </VStack>
        </Example>

        <Example
          title="Dismissible with an action"
          description="Providing `onDismiss` renders the close control; `action` sits opposite it."
          code={`<Alert
  tone="info"
  title="New version available"
  onDismiss={() => {}}
  action={<Button size="sm" variant="outline">Update</Button>}
>
  Reload to get the latest fixes.
</Alert>`}
        >
          <AlertDismissDemo />
        </Example>
      </ExampleGroup>
    );
  }

  if (slug === 'toast') {
    return (
      <ExampleGroup>
        <Example
          title="Triggering toasts"
          description="Add ToastProvider once at the root, then call useToast() anywhere below it."
          code={`// app/layout.tsx
<ToastProvider>{children}</ToastProvider>

// anywhere in a client component
const { toast } = useToast();

<Button
  onClick={() =>
    toast({
      title: 'Saved',
      description: 'Your changes are live.',
      tone: 'success',
    })
  }
>
  Save
</Button>`}
        >
          <ToastDemo />
        </Example>

        <Example
          title="Stacking and duration"
          description="Toasts stack up to the provider limit and auto-dismiss after the given duration. Use 0 to keep one until dismissed."
          code={`toast({ title: 'Upload started', tone: 'info' });
toast({ title: 'Still processing…', duration: 8000 });
toast({ title: 'Needs attention', tone: 'warning', duration: 0 });`}
        >
          <ToastDurationDemo />
        </Example>
      </ExampleGroup>
    );
  }

  return null;
}
