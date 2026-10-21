import { FormField, Fieldset } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup } from '@/components/ui/radio-group';
import { NumberInput } from '@/components/ui/number-input';
import { Slider } from '@/components/ui/slider';
import { HStack, VStack } from '@/components/ui/stack';
import { SearchIcon, LockIcon } from '@/components/ui/icons';
import { Example, ExampleGroup } from '@/components/docs/example';
import { FormFieldDemo, SwitchDemo, SwitchSizesDemo, DatePickerDemo, DatePickerRangeDemo } from '@/content/demos';

export function FormsDocs({ slug }: { slug: string }) {
  if (slug === 'form-field') {
    return (
      <ExampleGroup>
        <Example
          title="Label, hint, and error"
          description="One wrapper keeps the vertical rhythm and messaging consistent across a form."
          code={`<FormField label="Work email" htmlFor="email" hint="We'll never share it." required>
  <Input id="email" type="email" placeholder="you@company.com" />
</FormField>

<FormField label="Password" htmlFor="password" error="Use at least 8 characters.">
  <Input id="password" type="password" invalid />
</FormField>`}
        >
          <VStack gap="lg" className="max-w-sm">
            <FormField label="Work email" htmlFor="ff-email" hint="We'll never share it." required>
              <Input id="ff-email" type="email" placeholder="you@company.com" />
            </FormField>
            <FormField label="Password" htmlFor="ff-password" error="Use at least 8 characters.">
              <Input id="ff-password" type="password" invalid defaultValue="short" />
            </FormField>
          </VStack>
        </Example>

        <Example
          title="Composed field"
          description="A realistic field with an icon, hint, and required marker."
          code={`<FormField label="Email" htmlFor="email" hint="We'll send a magic link." required>
  <Input id="email" startIcon={<MailIcon />} placeholder="you@company.com" />
</FormField>`}
        >
          <div className="max-w-sm">
            <FormFieldDemo />
          </div>
        </Example>
      </ExampleGroup>
    );
  }

  if (slug === 'fieldset') {
    return (
      <ExampleGroup>
        <Example
          title="Grouping controls"
          description="Fieldset is the correct semantic wrapper for a group of related controls."
          code={`<Fieldset legend="Notification preferences" description="Choose what we email you about.">
  <Checkbox label="Product updates" defaultChecked />
  <Checkbox label="Weekly digest" />
  <Checkbox label="Security alerts" defaultChecked />
</Fieldset>`}
        >
          <Fieldset legend="Notification preferences" description="Choose what we email you about.">
            <Checkbox label="Product updates" defaultChecked />
            <Checkbox label="Weekly digest" />
            <Checkbox label="Security alerts" defaultChecked />
          </Fieldset>
        </Example>
      </ExampleGroup>
    );
  }

  if (slug === 'input') {
    return (
      <ExampleGroup>
        <Example
          title="Sizes and states"
          description="Three heights share the same border and focus-ring system."
          code={`<Input size="sm" placeholder="Small" />
<Input size="md" placeholder="Medium" />
<Input size="lg" placeholder="Large" />
<Input invalid defaultValue="Not an email" />`}
        >
          <VStack gap="sm" className="max-w-sm">
            <Input size="sm" placeholder="Small" />
            <Input size="md" placeholder="Medium" />
            <Input size="lg" placeholder="Large" />
            <Input invalid defaultValue="Not an email" />
          </VStack>
        </Example>

        <Example
          title="Adornments"
          description="Leading icons, trailing icons, or a fully interactive trailing slot."
          code={`<Input startIcon={<SearchIcon />} placeholder="Search…" />
<Input startIcon={<LockIcon />} type="password" placeholder="Password" />
<Input placeholder="Amount" endSlot={<span className="text-xs text-fg-subtle">USD</span>} />`}
        >
          <VStack gap="sm" className="max-w-sm">
            <Input startIcon={<SearchIcon />} placeholder="Search…" />
            <Input startIcon={<LockIcon />} type="password" placeholder="Password" />
            <Input
              placeholder="Amount"
              endSlot={<span className="pr-2 text-xs text-fg-subtle">USD</span>}
            />
          </VStack>
        </Example>
      </ExampleGroup>
    );
  }

  if (slug === 'textarea') {
    return (
      <ExampleGroup>
        <Example
          title="Multi-line input"
          description="Shares the Input styling system, with optional auto-resize."
          code={`<Textarea placeholder="Tell us about your project…" />
<Textarea autoResize placeholder="This one grows as you type…" />`}
        >
          <VStack gap="sm" className="max-w-md">
            <Textarea placeholder="Tell us about your project…" />
            <Textarea autoResize placeholder="This one grows as you type…" rows={2} />
          </VStack>
        </Example>
      </ExampleGroup>
    );
  }

  if (slug === 'select') {
    return (
      <ExampleGroup>
        <Example
          title="Native select"
          description="A real `<select>` with themed affordances and full keyboard support."
          code={`<Select
  placeholder="Choose a plan"
  options={[
    { label: 'Starter', value: 'starter' },
    { label: 'Pro', value: 'pro' },
    { label: 'Enterprise', value: 'enterprise' },
  ]}
/>`}
        >
          <div className="max-w-xs">
            <Select
              placeholder="Choose a plan"
              defaultValue=""
              options={[
                { label: 'Starter', value: 'starter' },
                { label: 'Pro', value: 'pro' },
                { label: 'Enterprise', value: 'enterprise' },
              ]}
            />
          </div>
        </Example>
      </ExampleGroup>
    );
  }

  if (slug === 'checkbox') {
    return (
      <ExampleGroup>
        <Example
          title="With label and hint"
          description="The label wraps the control, so the click target is the whole row."
          code={`<Checkbox label="Accept terms" hint="You can change this later." defaultChecked />
<Checkbox label="Subscribe to updates" />
<Checkbox label="Disabled option" disabled />`}
        >
          <VStack gap="md">
            <Checkbox label="Accept terms" hint="You can change this later." defaultChecked />
            <Checkbox label="Subscribe to updates" />
            <Checkbox label="Disabled option" disabled />
          </VStack>
        </Example>
      </ExampleGroup>
    );
  }

  if (slug === 'switch') {
    return (
      <ExampleGroup>
        <Example
          title="Controlled switch"
          description="Switch requires `checked` and `onCheckedChange`, keeping it trivially controlled."
          code={`const [checked, setChecked] = useState(true);

<Switch checked={checked} onCheckedChange={setChecked} label="Enable notifications" />`}
        >
          <SwitchDemo />
        </Example>
        <Example
          title="Sizes"
          description="Small and medium tracks."
          code={`<Switch size="sm" checked={a} onCheckedChange={setA} />
<Switch size="md" checked={b} onCheckedChange={setB} />`}
        >
          <SwitchSizesDemo />
        </Example>
      </ExampleGroup>
    );
  }

  if (slug === 'radio-group') {
    return (
      <ExampleGroup>
        <Example
          title="Radio group"
          description="Native radios sharing a name — arrow-key navigation for free."
          code={`<RadioGroup
  name="plan"
  defaultValue="pro"
  options={[
    { label: 'Starter', value: 'starter', hint: 'For side projects' },
    { label: 'Pro', value: 'pro', hint: 'For growing teams' },
    { label: 'Enterprise', value: 'enterprise', hint: 'Custom contracts' },
  ]}
/>`}
        >
          <RadioGroup
            name="docs-plan"
            defaultValue="pro"
            options={[
              { label: 'Starter', value: 'starter', hint: 'For side projects' },
              { label: 'Pro', value: 'pro', hint: 'For growing teams' },
              { label: 'Enterprise', value: 'enterprise', hint: 'Custom contracts' },
            ]}
          />
        </Example>
      </ExampleGroup>
    );
  }

  if (slug === 'number-input') {
    return (
      <ExampleGroup>
        <Example
          title="Stepper"
          description="Clamps to min/max on every change, including typing."
          code={`<NumberInput defaultValue={3} min={1} max={10} />
<NumberInput defaultValue={0} min={0} max={100} step={5} />`}
        >
          <HStack gap="md" wrap="wrap">
            <div className="w-40">
              <NumberInput defaultValue={3} min={1} max={10} aria-label="Seats" />
            </div>
            <div className="w-40">
              <NumberInput defaultValue={0} min={0} max={100} step={5} aria-label="Percent" />
            </div>
          </HStack>
        </Example>
      </ExampleGroup>
    );
  }

  if (slug === 'slider') {
    return (
      <ExampleGroup>
        <Example
          title="Range input"
          description="A native range control themed with accent-color."
          code={`<Slider defaultValue={40} min={0} max={100} aria-label="Volume" />`}
        >
          <div className="max-w-sm">
            <Slider defaultValue={40} min={0} max={100} aria-label="Volume" />
          </div>
        </Example>
      </ExampleGroup>
    );
  }

  if (slug === 'date-picker') {
    return (
      <ExampleGroup>
        <Example
          title="Single date"
          description={'A month grid with bounds, plus a native `<input type="date">` for typed entry and mobile pickers.'}
          code={`const [date, setDate] = useState<Date | null>(new Date(2026, 9, 14));

<DatePicker
  value={date}
  onChange={setDate}
  min={new Date(2026, 0, 1)}
  max={new Date(2026, 11, 31)}
  label="Appointment date"
/>`}
        >
          <DatePickerDemo />
        </Example>

        <Example
          title="Range selection"
          description="Two clicks choose an inclusive window: first sets the start, the second sets the end (or resets if earlier)."
          code={`const [range, setRange] = useState<DateRange>({
  start: new Date(2026, 9, 5),
  end: new Date(2026, 9, 19),
});

<DatePicker mode="range" rangeValue={range} onRangeChange={setRange} label="Reporting window" />`}
        >
          <DatePickerRangeDemo />
        </Example>
      </ExampleGroup>
    );
  }

  return null;
}
