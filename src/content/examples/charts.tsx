import { Sparkline } from '@/components/ui/sparkline';
import { LineChart } from '@/components/ui/line-chart';
import { BarChart } from '@/components/ui/bar-chart';
import { DonutChart } from '@/components/ui/donut-chart';
import { Heatmap } from '@/components/ui/heatmap';
import { ColorSwatch } from '@/components/ui/color-swatch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Grid } from '@/components/ui/grid';
import { HStack, VStack } from '@/components/ui/stack';
import { Example, ExampleGroup } from '@/components/docs/example';

const BRAND_RAMP = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900] as const;

export function ChartsDocs({ slug }: { slug: string }) {
  if (slug === 'sparkline') {
    return (
      <ExampleGroup>
        <Example
          title="Tones"
          description="Six semantic tones, all resolved from CSS custom properties."
          code={`<Sparkline data={[4, 6, 5, 8, 7, 11, 9, 13, 12, 15]} tone="brand" />
<Sparkline data={[9, 8, 9, 7, 8, 6, 7, 5, 6, 4]} tone="danger" />
<Sparkline data={[3, 4, 3, 5, 6, 5, 7, 9, 8, 11]} tone="success" />`}
        >
          <VStack gap="md" className="max-w-md">
            <Sparkline data={[4, 6, 5, 8, 7, 11, 9, 13, 12, 15]} tone="brand" />
            <Sparkline data={[9, 8, 9, 7, 8, 6, 7, 5, 6, 4]} tone="danger" />
            <Sparkline data={[3, 4, 3, 5, 6, 5, 7, 9, 8, 11]} tone="success" />
          </VStack>
        </Example>

        <Example
          title="Area and marker"
          description="`area` adds the soft fill; `marker` dots the latest value."
          code={`<Sparkline data={[12, 14, 13, 17, 19, 18, 22, 26]} tone="brand" area marker height={48} />`}
        >
          <div className="max-w-md">
            <Sparkline data={[12, 14, 13, 17, 19, 18, 22, 26]} tone="brand" area marker height={48} />
          </div>
        </Example>

        <Example
          title="In a table"
          description="The most common home for a sparkline: a trend column beside a formatted figure."
          code={`<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Service</TableHead>
      <TableHead className="text-right">p95</TableHead>
      <TableHead>Last 24h</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell className="font-medium">api-gateway</TableCell>
      <TableCell className="text-right tabular-nums">128 ms</TableCell>
      <TableCell>
        <div className="w-28">
          <Sparkline data={[110, 124, 118, 131, 126, 128]} tone="success" />
        </div>
      </TableCell>
    </TableRow>
    <TableRow>
      <TableCell className="font-medium">search-index</TableCell>
      <TableCell className="text-right tabular-nums">412 ms</TableCell>
      <TableCell>
        <div className="w-28">
          <Sparkline data={[280, 302, 341, 388, 401, 412]} tone="warning" area />
        </div>
      </TableCell>
    </TableRow>
    <TableRow>
      <TableCell className="font-medium">recommender</TableCell>
      <TableCell className="text-right tabular-nums">96 ms</TableCell>
      <TableCell>
        <div className="w-28">
          <Sparkline data={[88, 91, 84, 93, 86, 96]} tone="info" />
        </div>
      </TableCell>
    </TableRow>
  </TableBody>
</Table>`}
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service</TableHead>
                <TableHead className="text-right">p95</TableHead>
                <TableHead>Last 24h</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">api-gateway</TableCell>
                <TableCell className="text-right tabular-nums">128 ms</TableCell>
                <TableCell>
                  <div className="w-28">
                    <Sparkline data={[110, 124, 118, 131, 126, 128]} tone="success" />
                  </div>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">search-index</TableCell>
                <TableCell className="text-right tabular-nums">412 ms</TableCell>
                <TableCell>
                  <div className="w-28">
                    <Sparkline data={[280, 302, 341, 388, 401, 412]} tone="warning" area />
                  </div>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">recommender</TableCell>
                <TableCell className="text-right tabular-nums">96 ms</TableCell>
                <TableCell>
                  <div className="w-28">
                    <Sparkline data={[88, 91, 84, 93, 86, 96]} tone="info" />
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Example>
      </ExampleGroup>
    );
  }

  if (slug === 'line-chart') {
    return (
      <ExampleGroup>
        <Example
          title="Single series"
          description="Labels, an area fill, and ticks the chart rounds to a human-friendly step."
          code={`<LineChart
  labels={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']}
  series={[{ name: 'Revenue', data: [42, 48, 45, 61, 58, 72, 78] }]}
  area
  label="Monthly revenue"
/>`}
        >
          <LineChart
            labels={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']}
            series={[{ name: 'Revenue', data: [42, 48, 45, 61, 58, 72, 78] }]}
            area
            label="Monthly revenue"
          />
        </Example>

        <Example
          title="Multiple series"
          description="Every series shares one domain, and the legend picks up the tone automatically."
          code={`<LineChart
  labels={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']}
  series={[
    { name: 'This year', data: [42, 48, 45, 61, 58, 72, 78] },
    { name: 'Last year', data: [38, 41, 44, 47, 52, 55, 60], dashed: true },
  ]}
  label="Revenue, year over year"
/>`}
        >
          <LineChart
            labels={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']}
            series={[
              { name: 'This year', data: [42, 48, 45, 61, 58, 72, 78] },
              { name: 'Last year', data: [38, 41, 44, 47, 52, 55, 60], dashed: true },
            ]}
            label="Revenue, year over year"
          />
        </Example>

        <Example
          title="Explicit tones"
          description="Name a tone per series when the colours carry meaning; drop the grid and legend for a small multiple."
          code={`<LineChart
  labels={['09:00', '10:00', '11:00', '12:00', '13:00', '14:00']}
  series={[
    { name: 'Errors', data: [4, 6, 5, 14, 9, 6], tone: 'danger' },
    { name: 'Warnings', data: [22, 25, 31, 38, 34, 29], tone: 'warning' },
  ]}
  showGrid={false}
  showLegend={false}
  height={160}
  label="Errors and warnings by hour"
/>`}
        >
          <LineChart
            labels={['09:00', '10:00', '11:00', '12:00', '13:00', '14:00']}
            series={[
              { name: 'Errors', data: [4, 6, 5, 14, 9, 6], tone: 'danger' },
              { name: 'Warnings', data: [22, 25, 31, 38, 34, 29], tone: 'warning' },
            ]}
            showGrid={false}
            showLegend={false}
            height={160}
            label="Errors and warnings by hour"
          />
        </Example>
      </ExampleGroup>
    );
  }

  if (slug === 'bar-chart') {
    return (
      <ExampleGroup>
        <Example
          title="Grouped"
          description="Two series side by side, one group per label."
          code={`<BarChart
  labels={['Q1', 'Q2', 'Q3', 'Q4']}
  series={[
    { name: 'New', data: [120, 140, 132, 168] },
    { name: 'Renewal', data: [80, 92, 104, 118] },
  ]}
  label="Signed accounts by quarter"
/>`}
        >
          <BarChart
            labels={['Q1', 'Q2', 'Q3', 'Q4']}
            series={[
              { name: 'New', data: [120, 140, 132, 168] },
              { name: 'Renewal', data: [80, 92, 104, 118] },
            ]}
            label="Signed accounts by quarter"
          />
        </Example>

        <Example
          title="Stacked"
          description="Set `stacked` to read the series as a total with a composition."
          code={`<BarChart
  labels={['Q1', 'Q2', 'Q3', 'Q4']}
  series={[
    { name: 'New', data: [120, 140, 132, 168], tone: 'brand' },
    { name: 'Renewal', data: [80, 92, 104, 118], tone: 'success' },
  ]}
  stacked
  label="Signed accounts by quarter, stacked"
/>`}
        >
          <BarChart
            labels={['Q1', 'Q2', 'Q3', 'Q4']}
            series={[
              { name: 'New', data: [120, 140, 132, 168], tone: 'brand' },
              { name: 'Renewal', data: [80, 92, 104, 118], tone: 'success' },
            ]}
            stacked
            label="Signed accounts by quarter, stacked"
          />
        </Example>

        <Example
          title="Single series"
          description="One series, no legend, no grid — a plain weekly histogram."
          code={`<BarChart
  labels={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']}
  series={[{ name: 'Deploys', data: [18, 24, 31, 27, 35, 8, 3], tone: 'info' }]}
  showLegend={false}
  showGrid={false}
  height={160}
  label="Deploys per day"
/>`}
        >
          <BarChart
            labels={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']}
            series={[{ name: 'Deploys', data: [18, 24, 31, 27, 35, 8, 3], tone: 'info' }]}
            showLegend={false}
            showGrid={false}
            height={160}
            label="Deploys per day"
          />
        </Example>
      </ExampleGroup>
    );
  }

  if (slug === 'donut-chart') {
    return (
      <ExampleGroup>
        <Example
          title="With a centre figure"
          description="The ring carries the split; the centre carries the headline number."
          code={`<DonutChart
  data={[
    { label: 'Direct', value: 4210 },
    { label: 'Search', value: 3180 },
    { label: 'Referral', value: 1540 },
    { label: 'Social', value: 870 },
  ]}
  centerValue="9.8k"
  centerLabel="Sessions"
  label="Sessions by channel"
/>`}
        >
          <DonutChart
            data={[
              { label: 'Direct', value: 4210 },
              { label: 'Search', value: 3180 },
              { label: 'Referral', value: 1540 },
              { label: 'Social', value: 870 },
            ]}
            centerValue="9.8k"
            centerLabel="Sessions"
            label="Sessions by channel"
          />
        </Example>

        <Example
          title="Explicit tones"
          description="Assign a tone per slice when the categories have a fixed meaning."
          code={`<DonutChart
  data={[
    { label: 'Passing', value: 82, tone: 'success' },
    { label: 'Flaky', value: 11, tone: 'warning' },
    { label: 'Failing', value: 7, tone: 'danger' },
  ]}
  thickness={16}
  centerValue="82%"
  label="Test suite health"
/>`}
        >
          <DonutChart
            data={[
              { label: 'Passing', value: 82, tone: 'success' },
              { label: 'Flaky', value: 11, tone: 'warning' },
              { label: 'Failing', value: 7, tone: 'danger' },
            ]}
            thickness={16}
            centerValue="82%"
            label="Test suite health"
          />
        </Example>

        <Example
          title="Ring only"
          description="`showLegend={false}` leaves a compact ring for stat tiles; `size` sets the diameter."
          code={`<HStack gap="lg" align="center">
  <DonutChart
    data={[
      { label: 'Used', value: 68, tone: 'brand' },
      { label: 'Free', value: 32, tone: 'neutral' },
    ]}
    size={96}
    thickness={12}
    showLegend={false}
    centerValue="68%"
  />
  <DonutChart
    data={[
      { label: 'Used', value: 91, tone: 'danger' },
      { label: 'Free', value: 9, tone: 'neutral' },
    ]}
    size={96}
    thickness={12}
    showLegend={false}
    centerValue="91%"
  />
</HStack>`}
        >
          <HStack gap="lg" align="center">
            <DonutChart
              data={[
                { label: 'Used', value: 68, tone: 'brand' },
                { label: 'Free', value: 32, tone: 'neutral' },
              ]}
              size={96}
              thickness={12}
              showLegend={false}
              centerValue="68%"
            />
            <DonutChart
              data={[
                { label: 'Used', value: 91, tone: 'danger' },
                { label: 'Free', value: 9, tone: 'neutral' },
              ]}
              size={96}
              thickness={12}
              showLegend={false}
              centerValue="91%"
            />
          </HStack>
        </Example>
      </ExampleGroup>
    );
  }

  if (slug === 'heatmap') {
    return (
      <ExampleGroup>
        <Example
          title="Retention grid"
          description="Zeros render as empty cells, which is how a cohort matrix shows periods that have not happened yet. Values are printed in every cell, so colour is never the only signal."
          code={`<Heatmap
  rowLabels={['Jan', 'Feb', 'Mar', 'Apr', 'May']}
  columnLabels={['D1', 'D7', 'D14', 'D30', 'D60', 'D90']}
  data={[
    [100, 62, 48, 41, 34, 29],
    [100, 64, 51, 44, 37, 31],
    [100, 61, 46, 38, 30, 0],
    [100, 66, 53, 45, 0, 0],
    [100, 63, 49, 0, 0, 0],
  ]}
  label="Weekly retention by cohort"
/>`}
        >
          <Heatmap
            rowLabels={['Jan', 'Feb', 'Mar', 'Apr', 'May']}
            columnLabels={['D1', 'D7', 'D14', 'D30', 'D60', 'D90']}
            data={[
              [100, 62, 48, 41, 34, 29],
              [100, 64, 51, 44, 37, 31],
              [100, 61, 46, 38, 30, 0],
              [100, 66, 53, 45, 0, 0],
              [100, 63, 49, 0, 0, 0],
            ]}
            label="Weekly retention by cohort"
          />
        </Example>

        <Example
          title="Tones and floor"
          description="`tone` swaps the ramp; `floor` controls which cells count as empty."
          code={`<Heatmap
  rowLabels={['us-east-1', 'us-west-2', 'eu-central-1']}
  columnLabels={['00', '04', '08', '12', '16', '20']}
  data={[
    [12, 8, 42, 96, 88, 31],
    [9, 7, 38, 91, 79, 26],
    [6, 5, 21, 54, 47, 18],
  ]}
  tone="danger"
  showLegend={false}
  label="Request volume by region and hour"
/>`}
        >
          <Heatmap
            rowLabels={['us-east-1', 'us-west-2', 'eu-central-1']}
            columnLabels={['00', '04', '08', '12', '16', '20']}
            data={[
              [12, 8, 42, 96, 88, 31],
              [9, 7, 38, 91, 79, 26],
              [6, 5, 21, 54, 47, 18],
            ]}
            tone="danger"
            showLegend={false}
            label="Request volume by region and hour"
          />
        </Example>
      </ExampleGroup>
    );
  }

  if (slug === 'color-swatch') {
    return (
      <ExampleGroup>
        <Example
          title="Sizes and shapes"
          description="Three sizes, square or circular."
          code={`<HStack gap="lg" align="end">
  <ColorSwatch color="var(--color-brand-500)" size="sm" />
  <ColorSwatch color="var(--color-brand-500)" size="md" />
  <ColorSwatch color="var(--color-brand-500)" size="lg" />
  <ColorSwatch color="var(--color-brand-500)" size="lg" shape="circle" />
</HStack>`}
        >
          <HStack gap="lg" align="end">
            <ColorSwatch color="var(--color-brand-500)" size="sm" />
            <ColorSwatch color="var(--color-brand-500)" size="md" />
            <ColorSwatch color="var(--color-brand-500)" size="lg" />
            <ColorSwatch color="var(--color-brand-500)" size="lg" shape="circle" />
          </HStack>
        </Example>

        <Example
          title="A token ramp"
          description="Pass `var(--color-*)` references and the ramp follows the active theme instead of freezing a hex value. Pair with `value` to print the token name."
          code={`<Grid columns={5} gap="md">
  {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((step) => (
    <ColorSwatch
      key={step}
      color={\`var(--color-brand-\${step})\`}
      label={\`\${step}\`}
      value="brand"
    />
  ))}
</Grid>`}
        >
          <Grid columns={5} gap="md">
            {BRAND_RAMP.map((step) => (
              <ColorSwatch
                key={step}
                color={`var(--color-brand-${step})`}
                label={String(step)}
                value="brand"
              />
            ))}
          </Grid>
        </Example>

        <Example
          title="With captions"
          description="A labelled palette row, the shape a brand-kit page actually takes."
          code={`<HStack gap="xl" wrap="wrap">
  <ColorSwatch
    color="var(--color-success)"
    label="Success"
    value="--color-success"
  />
  <ColorSwatch
    color="var(--color-warning)"
    label="Warning"
    value="--color-warning"
  />
  <ColorSwatch
    color="var(--color-danger)"
    label="Danger"
    value="--color-danger"
  />
  <ColorSwatch
    color="var(--color-info)"
    label="Info"
    value="--color-info"
  />
</HStack>`}
        >
          <HStack gap="xl" wrap="wrap">
            <ColorSwatch color="var(--color-success)" label="Success" value="--color-success" />
            <ColorSwatch color="var(--color-warning)" label="Warning" value="--color-warning" />
            <ColorSwatch color="var(--color-danger)" label="Danger" value="--color-danger" />
            <ColorSwatch color="var(--color-info)" label="Info" value="--color-info" />
          </HStack>
        </Example>
      </ExampleGroup>
    );
  }

  return (
    <ExampleGroup>
      <Example
        title="Charts"
        description="Dependency-free visualisations that paint with theme tokens."
        code={`<Sparkline data={[4, 6, 5, 8, 7, 11]} tone="brand" />`}
      >
        <div className="flex max-w-sm flex-col gap-3">
          <p className="text-sm text-fg-muted">
            Pick a chart from the sidebar to see live examples.
          </p>
          <Sparkline data={[4, 6, 5, 8, 7, 11]} tone="brand" height={40} area marker />
        </div>
      </Example>
    </ExampleGroup>
  );
}
