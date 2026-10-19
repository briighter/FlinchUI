'use client';

import { useState } from 'react';
import { cn } from '@/lib/cn';
import { extent, scaleLinear } from '@/components/ui/chart-shared';
import { useMeasure } from '@/lib/hooks/use-measure';
import { series } from '@/lib/random';
import { Alert } from '@/components/ui/alert';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CircularProgress } from '@/components/ui/progress';
import { IconButton } from '@/components/ui/icon-button';
import { Timeline } from '@/components/ui/timeline';
import {
  BellIcon,
  CalendarIcon,
  CheckIcon,
  ChevronRightIcon,
  ClockIcon,
  HeartIcon,
  InfoIcon,
  MailIcon,
  PhoneIcon,
  UserIcon,
} from '@/components/ui/icons';
import { PhoneSheet } from '../lib/phone-sheet';

/* ----------------------------------- data ---------------------------------- */

const BLOOD_PRESSURE = series(71, { count: 30, start: 128, drift: 0.03, bias: -0.002, min: 112, max: 142, precision: 0 });
const RESTING_HEART_RATE = series(72, { count: 30, start: 68, drift: 0.04, bias: -0.001, min: 58, max: 82, precision: 0 });
const WEIGHT = series(73, { count: 30, start: 156, drift: 0.012, bias: -0.0012, min: 150, max: 160, precision: 1 });

interface Medication {
  id: string;
  name: string;
  dose: string;
  schedule: string;
  reason: string;
  refills: number;
  tone: 'brand' | 'info' | 'warning';
}

const MEDICATIONS: Medication[] = [
  { id: 'lisinopril', name: 'Lisinopril', dose: '10 mg', schedule: '8:00 AM', reason: 'Blood pressure', refills: 2, tone: 'brand' },
  { id: 'metformin', name: 'Metformin', dose: '500 mg', schedule: '8:00 AM · 6:00 PM', reason: 'Blood sugar', refills: 1, tone: 'info' },
  { id: 'atorvastatin', name: 'Atorvastatin', dose: '20 mg', schedule: '9:00 PM', reason: 'Cholesterol', refills: 3, tone: 'brand' },
  { id: 'vitamin-d', name: 'Vitamin D3', dose: '1,000 IU', schedule: '8:00 AM', reason: 'Supplement', refills: 5, tone: 'warning' },
];

const CARE_HISTORY = [
  { title: 'Cardiology follow-up', description: 'Dr. Amara Osei · Riversbend Heart Centre', timestamp: 'Mar 4', status: 'complete' as const },
  { title: 'Lipid panel drawn', description: 'LDL 96 mg/dL — within target', timestamp: 'Feb 18', status: 'complete' as const },
  { title: 'Annual physical', description: 'Dr. Marcus Hale · Riverside Family Practice', timestamp: 'Jan 9', status: 'complete' as const },
  { title: 'Next: cardiology review', description: 'Bring the home blood pressure log', timestamp: 'Apr 12', status: 'upcoming' as const },
];

const MESSAGES = [
  { from: 'Amara Osei, MD', preview: 'Your readings look steady. Keep the evening dose where it is.', time: '2d', unread: true },
  { from: 'Riverside Pharmacy', preview: 'Metformin is ready for pickup at the Grand Ave counter.', time: '4d', unread: false },
  { from: 'Lab results', preview: 'Lipid panel posted to your record. No action needed.', time: '1w', unread: false },
];

/* ------------------------------ vitals chart ------------------------------- */

function VitalsChart({
  data,
  band,
  tone = 'brand',
  height = 60,
}: {
  data: number[];
  band?: [number, number];
  tone?: 'brand' | 'success' | 'danger' | 'info';
  height?: number;
}) {
  const [ref, { width }] = useMeasure<HTMLDivElement>();
  const w = width || 1;
  const values = band ? [...data, band[0], band[1]] : data;
  const [low, high] = extent(values);
  const padding = (high - low) * 0.2 || 1;
  const y = scaleLinear([low - padding, high + padding], [height - 3, 3]);

  const points = data.map((value, index) => [
    (index / Math.max(1, data.length - 1)) * w,
    y(value),
  ]);
  const path = points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point[0]} ${point[1]}`).join(' ');

  return (
    <div ref={ref} className="w-full">
      <svg width="100%" height={height} viewBox={`0 0 ${w} ${height}`} aria-hidden="true">
        {band ? (
          <rect
            x={0}
            y={y(band[1])}
            width={w}
            height={Math.max(1, y(band[0]) - y(band[1]))}
            fill="var(--color-success)"
            fillOpacity={0.14}
            rx={3}
          />
        ) : null}
        <path
          d={path}
          fill="none"
          stroke={`var(--color-${tone === 'brand' ? 'brand-500' : tone})`}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
        {points.length > 0 ? (
          <circle cx={points[points.length - 1]![0]} cy={points[points.length - 1]![1]} r={3} fill={`var(--color-${tone === 'brand' ? 'brand-500' : tone})`} />
        ) : null}
      </svg>
    </div>
  );
}

/* ---------------------------------- app ------------------------------------ */

type Tab = 'today' | 'meds' | 'vitals' | 'messages';

const TABS: { id: Tab; label: string }[] = [
  { id: 'today', label: 'Today' },
  { id: 'meds', label: 'Meds' },
  { id: 'vitals', label: 'Vitals' },
  { id: 'messages', label: 'Inbox' },
];

export function PatientApp() {
  const [tab, setTab] = useState<Tab>('today');
  const [taken, setTaken] = useState<string[]>(['lisinopril', 'vitamin-d']);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const doseCount = MEDICATIONS.length;
  const adherence = (taken.length / doseCount) * 100;

  function toggleMed(id: string) {
    setTaken((previous) =>
      previous.includes(id) ? previous.filter((item) => item !== id) : [...previous, id],
    );
  }

  return (
    <div className="relative flex h-full flex-col bg-bg">
      <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border px-4">
        <Avatar name="Ruth Alvarez" size="md" />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-fg">Ruth Alvarez</p>
          <p className="truncate text-xs text-fg-subtle">MRN · 4471-8820</p>
        </div>
        <IconButton label="Notifications" size="sm" variant="ghost" className="ml-auto">
          <BellIcon />
        </IconButton>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {tab === 'today' ? (
          <div className="flex flex-col gap-4 p-4">
            <Alert tone="info" icon={<InfoIcon />} title="Two doses still due today">
              Metformin at 6:00 PM and Atorvastatin at 9:00 PM.
            </Alert>

            <Card padding="none" className="overflow-hidden">
              <div className="flex items-center gap-2 border-b border-border bg-surface-sunken px-4 py-2.5">
                <CalendarIcon className="size-4 text-fg-subtle" />
                <span className="text-xs font-semibold tracking-wide text-fg-subtle uppercase">
                  Next appointment
                </span>
              </div>
              <div className="flex flex-col gap-3 p-4">
                <div>
                  <p className="text-2xl font-bold tracking-tight text-fg">Tue, Apr 12</p>
                  <p className="mt-0.5 text-sm text-fg-muted">9:15 AM · 30 minutes</p>
                </div>
                <dl className="flex flex-col gap-2 text-sm">
                  <div className="flex items-center gap-2.5">
                    <UserIcon className="size-4 shrink-0 text-fg-subtle" />
                    <dt className="sr-only">Clinician</dt>
                    <dd className="text-fg">
                      Dr. Amara Osei <span className="text-fg-subtle">· Cardiology</span>
                    </dd>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <HeartIcon className="size-4 shrink-0 text-fg-subtle" />
                    <dt className="sr-only">Location</dt>
                    <dd className="text-fg">
                      Riversbend Heart Centre <span className="text-fg-subtle">· Suite 240</span>
                    </dd>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <ClockIcon className="size-4 shrink-0 text-fg-subtle" />
                    <dt className="sr-only">Arrive by</dt>
                    <dd className="text-fg">
                      Arrive by 9:00 AM <span className="text-fg-subtle">· check-in is 15 min</span>
                    </dd>
                  </div>
                </dl>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => setDetailsOpen(true)}>
                    Details
                  </Button>
                  <Button size="sm" variant="secondary">
                    Reschedule
                  </Button>
                  <Button size="sm" variant="ghost" startIcon={<PhoneIcon />}>
                    Call
                  </Button>
                </div>
              </div>
            </Card>

            <Card padding="none">
              <div className="flex items-center gap-3 border-b border-border px-4 py-3">
                <span className="text-xs font-semibold tracking-wide text-fg-subtle uppercase">
                  Today’s doses
                </span>
                <Badge tone={adherence === 100 ? 'success' : 'warning'} size="sm" className="ml-auto">
                  {taken.length} of {doseCount}
                </Badge>
              </div>
              <ul className="divide-y divide-border">
                {MEDICATIONS.map((medication) => {
                  const isTaken = taken.includes(medication.id);
                  return (
                    <li key={medication.id} className="flex items-center gap-3 px-4 py-3">
                      <span
                        className={cn(
                          'flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold',
                          isTaken ? 'bg-success-subtle text-success-fg' : 'bg-surface-sunken text-fg-muted',
                        )}
                      >
                        {isTaken ? <CheckIcon className="size-4" /> : medication.schedule.slice(0, 2)}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-fg">
                          {medication.name} <span className="text-fg-subtle">{medication.dose}</span>
                        </p>
                        <p className="truncate text-xs text-fg-subtle">
                          {medication.schedule} · {medication.reason}
                        </p>
                      </div>
                      <button
                        type="button"
                        aria-pressed={isTaken}
                        onClick={() => toggleMed(medication.id)}
                        className={cn(
                          'shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors',
                          isTaken
                            ? 'border-transparent bg-success-subtle text-success-fg'
                            : 'border-border-strong text-fg hover:bg-surface-sunken',
                        )}
                      >
                        {isTaken ? 'Taken' : 'Mark taken'}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </Card>

            <Card padding="none">
              <div className="flex items-center gap-3 border-b border-border px-4 py-3">
                <span className="text-xs font-semibold tracking-wide text-fg-subtle uppercase">
                  Care history
                </span>
              </div>
              <div className="p-4">
                <Timeline items={CARE_HISTORY} />
              </div>
            </Card>
          </div>
        ) : null}

        {tab === 'meds' ? (
          <div className="flex flex-col gap-4 p-4">
            <Card padding="md" className="flex items-center gap-4">
              <CircularProgress value={adherence} size={76} thickness={8} showValue label="Adherence this week" />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-fg">Weekly adherence</p>
                <p className="mt-1 text-xs leading-5 text-fg-muted">
                  You have taken {taken.length} of {doseCount} scheduled doses today. Refills are
                  ordered automatically when two are left.
                </p>
              </div>
            </Card>

            <ul className="flex flex-col gap-3">
              {MEDICATIONS.map((medication) => (
                <li key={medication.id}>
                  <Card padding="md" className="flex flex-col gap-3">
                    <div className="flex items-start gap-3">
                      <span className={cn('mt-1 size-2.5 shrink-0 rounded-full', medication.tone === 'brand' ? 'bg-brand-500' : medication.tone === 'info' ? 'bg-info' : 'bg-warning')} />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-fg">{medication.name}</p>
                        <p className="text-xs text-fg-subtle">
                          {medication.dose} · {medication.reason}
                        </p>
                      </div>
                      <Badge tone={medication.refills <= 1 ? 'warning' : 'neutral'} size="sm">
                        {medication.refills} refills
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between rounded-md bg-surface-sunken px-3 py-2 text-xs">
                      <span className="text-fg-muted">Schedule</span>
                      <span className="font-medium text-fg">{medication.schedule}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="secondary">
                        Request refill
                      </Button>
                      <Button size="sm" variant="ghost">
                        Side effects
                      </Button>
                    </div>
                  </Card>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {tab === 'vitals' ? (
          <div className="flex flex-col gap-4 p-4">
            <Card padding="md" className="flex flex-col gap-3">
              <div className="flex items-baseline justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-fg">Blood pressure</p>
                  <p className="text-xs text-fg-subtle">Systolic · last 30 days</p>
                </div>
                <span className="text-2xl font-bold tabular-nums text-fg">
                  128<span className="text-base font-medium text-fg-subtle">/82</span>
                </span>
              </div>
              <VitalsChart data={BLOOD_PRESSURE} band={[110, 130]} tone="brand" />
              <p className="text-xs text-fg-subtle">
                Target band 110–130. Six readings above target this month.
              </p>
            </Card>

            <Card padding="md" className="flex flex-col gap-3">
              <div className="flex items-baseline justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-fg">Resting heart rate</p>
                  <p className="text-xs text-fg-subtle">Beats per minute</p>
                </div>
                <span className="text-2xl font-bold tabular-nums text-fg">68</span>
              </div>
              <VitalsChart data={RESTING_HEART_RATE} band={[60, 75]} tone="danger" />
              <p className="text-xs text-fg-subtle">Steady since the medication change in February.</p>
            </Card>

            <Card padding="md" className="flex flex-col gap-3">
              <div className="flex items-baseline justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-fg">Weight</p>
                  <p className="text-xs text-fg-subtle">Pounds, from the home scale</p>
                </div>
                <span className="text-2xl font-bold tabular-nums text-fg">154.2</span>
              </div>
              <VitalsChart data={WEIGHT} band={[148, 158]} tone="info" />
              <p className="text-xs text-fg-subtle">Down 1.8 lb since the last visit.</p>
            </Card>
          </div>
        ) : null}

        {tab === 'messages' ? (
          <div className="flex flex-col gap-4 p-4">
            <Button variant="secondary" startIcon={<MailIcon />} fullWidth>
              Message your care team
            </Button>

            <ul className="flex flex-col gap-3">
              {MESSAGES.map((message) => (
                <li key={message.from}>
                  <Card padding="md" className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-fg">{message.from}</span>
                      {message.unread ? <Badge tone="brand" size="sm">New</Badge> : null}
                      <span className="ml-auto text-xs text-fg-subtle">{message.time}</span>
                    </div>
                    <p className="text-sm leading-6 text-fg-muted">{message.preview}</p>
                    <button
                      type="button"
                      className="flex items-center gap-1 self-start text-xs font-medium text-brand-600"
                    >
                      Open thread
                      <ChevronRightIcon className="size-3.5" />
                    </button>
                  </Card>
                </li>
              ))}
            </ul>

            <Alert tone="success" title="Your records are up to date">
              Nothing needs your attention. The next result arrives with your April visit.
            </Alert>
          </div>
        ) : null}
      </div>

      <nav aria-label="Patient app sections" className="flex h-14 shrink-0 items-center border-t border-border bg-surface px-2">
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            aria-current={tab === item.id ? 'page' : undefined}
            onClick={() => setTab(item.id)}
            className={cn(
              'flex flex-1 flex-col items-center gap-0.5 rounded-md py-1.5 text-[10px] font-medium transition-colors',
              tab === item.id ? 'text-brand-600' : 'text-fg-subtle hover:text-fg',
            )}
          >
            <span
              className={cn(
                'flex size-5 items-center justify-center',
                tab === item.id ? 'text-brand-600' : 'text-fg-subtle',
              )}
            >
              {item.id === 'today' ? (
                <CalendarIcon className="size-5" />
              ) : item.id === 'meds' ? (
                <CheckIcon className="size-5" />
              ) : item.id === 'vitals' ? (
                <HeartIcon className="size-5" />
              ) : (
                <MailIcon className="size-5" />
              )}
            </span>
            {item.label}
          </button>
        ))}
      </nav>

      <PhoneSheet
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        title="Appointment details"
      >
        <div className="flex flex-col gap-4">
          <div className="rounded-lg bg-surface-sunken p-4">
            <p className="text-lg font-semibold text-fg">Cardiology follow-up</p>
            <p className="mt-1 text-sm text-fg-muted">Tuesday, April 12 · 9:15 AM</p>
          </div>

          <dl className="flex flex-col gap-3 text-sm">
            {[
              ['Clinician', 'Dr. Amara Osei'],
              ['Location', 'Riversbend Heart Centre, Suite 240'],
              ['Phone', '(503) 555-0148'],
              ['Bring', 'Home blood pressure log, current medication list'],
              ['Parking', 'Level 2, validated at the front desk'],
            ].map(([label, value]) => (
              <div key={label} className="flex flex-col gap-0.5 border-b border-border pb-3 last:border-0">
                <dt className="text-xs text-fg-subtle">{label}</dt>
                <dd className="text-fg">{value}</dd>
              </div>
            ))}
          </dl>

          <Button fullWidth startIcon={<CalendarIcon />}>
            Add to calendar
          </Button>
        </div>
      </PhoneSheet>
    </div>
  );
}
