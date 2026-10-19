'use client';

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { cn } from '@/lib/cn';
import {
  createWatch,
  disposeObject,
  type BezelId,
  type CaseMaterialId,
  type DialId,
  type StrapColorId,
  type StrapId,
  type WatchConfig,
} from '../lib/watch';
import { Alert } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CopyButton } from '@/components/ui/copy-button';
import { Spinner } from '@/components/ui/spinner';
import { CheckIcon, RefreshIcon, SparklesIcon } from '@/components/ui/icons';

/* -------------------------------- catalogue -------------------------------- */

const BASE_PRICE = 1850;

/*
 * Chip colours are literal Tailwind arbitrary values so the compiler can see
 * them. They mirror `CASE_HEX` / `DIAL_HEX` / `STRAP_HEX` in `lib/watch.ts`,
 * which feed the 3D materials.
 */
const CASE_MATERIALS: { id: CaseMaterialId; label: string; note: string; price: number; chip: string }[] = [
  { id: 'steel', label: 'Stainless steel', note: '316L, brushed case band', price: 0, chip: 'bg-[#c9ced8]' },
  { id: 'titanium', label: 'Grade 5 titanium', note: 'Sandblasted, 31% lighter', price: 650, chip: 'bg-[#9aa3ad]' },
  { id: 'gold', label: '18k yellow gold', note: '5N alloy, hallmarked', price: 2400, chip: 'bg-[#d8b26a]' },
  { id: 'dlc', label: 'DLC steel', note: 'Diamond-like carbon, 2,200 HV', price: 420, chip: 'bg-[#31363f]' },
];

const CASE_SIZES: { value: number; label: string; note: string; price: number }[] = [
  { value: 36, label: '36 mm', note: '18 mm lugs · 9.8 mm thick', price: -80 },
  { value: 40, label: '40 mm', note: '20 mm lugs · 11.4 mm thick', price: 0 },
  { value: 44, label: '44 mm', note: '22 mm lugs · 12.9 mm thick', price: 140 },
];

const DIALS: { id: DialId; label: string; chip: string }[] = [
  { id: 'midnight', label: 'Midnight', chip: 'bg-[#101623]' },
  { id: 'slate', label: 'Slate', chip: 'bg-[#3f4756]' },
  { id: 'racing', label: 'Racing green', chip: 'bg-[#1e4636]' },
  { id: 'sunburst', label: 'Sunburst blue', chip: 'bg-[#1c3f78]' },
  { id: 'salmon', label: 'Salmon', chip: 'bg-[#e0856f]' },
  { id: 'ivory', label: 'Ivory lacquer', chip: 'bg-[#f1ead9]' },
];

const BEZELS: { id: BezelId; label: string; note: string; price: number }[] = [
  { id: 'smooth', label: 'Polished', note: 'Mirror-finished, stepped edge', price: 0 },
  { id: 'fluted', label: 'Fluted', note: 'Faceted, catches the light', price: 120 },
  { id: 'ceramic', label: 'Ceramic', note: 'Matte black, near scratch-proof', price: 240 },
];

const STRAPS: { id: StrapId; label: string; note: string; price: number }[] = [
  { id: 'bracelet', label: 'Bracelet', note: 'Three-link, in the case metal', price: 380 },
  { id: 'leather', label: 'Leather', note: 'Vegetable-tanned, quick-release', price: 0 },
  { id: 'rubber', label: 'Rubber', note: 'Vulcanised tropic profile', price: -40 },
  { id: 'nato', label: 'NATO', note: 'Single-pass nylon, stitched', price: -90 },
];

const STRAP_COLORS: { id: StrapColorId; label: string; chip: string }[] = [
  { id: 'onyx', label: 'Onyx', chip: 'bg-[#23262d]' },
  { id: 'tan', label: 'Tan', chip: 'bg-[#a9793f]' },
  { id: 'oxblood', label: 'Oxblood', chip: 'bg-[#5c2320]' },
  { id: 'navy', label: 'Navy', chip: 'bg-[#243a5e]' },
  { id: 'olive', label: 'Olive', chip: 'bg-[#4a5233]' },
  { id: 'cream', label: 'Cream', chip: 'bg-[#e6dcc8]' },
];

const DEFAULT_BUILD: WatchConfig = {
  caseMaterial: 'steel',
  caseSize: 40,
  dial: 'midnight',
  bezel: 'smooth',
  strap: 'bracelet',
  strapColor: 'onyx',
};

const usd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

const find = <T extends { id: string }>(list: T[], id: string) =>
  list.find((entry) => entry.id === id) ?? list[0]!;

const findSize = (value: number) => CASE_SIZES.find((entry) => entry.value === value) ?? CASE_SIZES[1]!;

function priceFor(build: WatchConfig) {
  const material = find(CASE_MATERIALS, build.caseMaterial).price;
  const size = findSize(build.caseSize).price;
  const bezel = find(BEZELS, build.bezel).price;
  const strap = find(STRAPS, build.strap).price;
  return { material, size, bezel, strap, total: BASE_PRICE + material + size + bezel + strap };
}

function describe(build: WatchConfig) {
  const material = find(CASE_MATERIALS, build.caseMaterial);
  const dial = find(DIALS, build.dial);
  const bezel = find(BEZELS, build.bezel);
  const strap = find(STRAPS, build.strap);
  const color = find(STRAP_COLORS, build.strapColor);
  return [
    'Orbit Chronograph',
    `${build.caseSize} mm ${material.label.toLowerCase()}`,
    `${dial.label} dial`,
    `${bezel.label} bezel`,
    strap.id === 'bracelet' ? 'bracelet in the case metal' : `${color.label} ${strap.label.toLowerCase()}`,
  ].join(' · ');
}

function specsFor(build: WatchConfig) {
  const lugWidth = build.caseSize === 36 ? 18 : build.caseSize === 40 ? 20 : 22;
  const thickness = build.caseSize === 36 ? 9.8 : build.caseSize === 40 ? 11.4 : 12.9;
  const reference = `OR-${build.caseSize}-${build.caseMaterial.slice(0, 2).toUpperCase()}${build.bezel[0]!.toUpperCase()}${build.strap[0]!.toUpperCase()}`;

  return [
    ['Reference', reference],
    ['Movement', 'Orbit cal. 4280 · automatic'],
    ['Power reserve', '68 hours'],
    ['Frequency', '28,800 vph (4 Hz)'],
    ['Crystal', 'Double-domed sapphire, AR-coated'],
    ['Case thickness', `${thickness.toFixed(1)} mm`],
    ['Lug width', `${lugWidth} mm`],
    ['Water resistance', '100 m (10 ATM)'],
    ['Warranty', '5 years, international'],
  ] as const;
}

/* --------------------------------- scene ----------------------------------- */

interface SceneHandle {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  controls: OrbitControls;
  renderer: THREE.WebGLRenderer;
  group: THREE.Group | null;
  fit: () => void;
}

export function ProductConfigurator() {
  const mountRef = useRef<HTMLDivElement>(null);
  const canvasHostRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<SceneHandle | null>(null);
  /** Half-height of the framing box, in world units. */
  const focusRef = useRef(3.4);

  const [build, setBuild] = useState<WatchConfig>(DEFAULT_BUILD);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [autoRotate, setAutoRotate] = useState(true);
  const [bag, setBag] = useState(0);
  const [justAdded, setJustAdded] = useState(false);
  const [saved, setSaved] = useState(false);

  const price = useMemo(() => priceFor(build), [build]);
  const specs = useMemo(() => specsFor(build), [build]);
  const summary = useMemo(() => describe(build), [build]);
  const [leadDate] = useState(() =>
    new Date(Date.now() + 9 * 86_400_000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
  );

  const set = useCallback(<K extends keyof WatchConfig>(key: K, value: WatchConfig[K]) => {
    setBuild((previous) => ({ ...previous, [key]: value }));
    setJustAdded(false);
    setSaved(false);
  }, []);

  /* ------------------------- renderer, camera, loop ----------------------- */

  useEffect(() => {
    const host = canvasHostRef.current;
    const mount = mountRef.current;
    if (!host || !mount) return;

    /*
     * The canvas is created imperatively rather than rendered by React. Strict
     * Mode mounts every effect twice in development, and a canvas that has been
     * through `forceContextLoss()` hands the *same* dead WebGL context back to
     * the next `getContext()` call — a fresh element per mount sidesteps that.
     */
    const canvas = document.createElement('canvas');
    canvas.className = 'block size-full';
    host.appendChild(canvas);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch {
      canvas.remove();
      setError('WebGL is unavailable in this browser, so the 3D preview cannot start.');
      return;
    }

    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 200);
    camera.position.set(0, 6.2, 9.4);

    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.enablePan = false;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1.15;
    controls.minPolarAngle = 0.2;
    controls.maxPolarAngle = 1.44;
    controls.target.set(0, -0.3, 0);

    // Image-based lighting: a procedural room gives the metals something to
    // reflect without shipping an HDR file.
    const pmrem = new THREE.PMREMGenerator(renderer);
    const room = new RoomEnvironment();
    const environment = pmrem.fromScene(room, 0.04).texture;
    scene.environment = environment;
    disposeObject(room);
    pmrem.dispose();

    const key = new THREE.DirectionalLight(0xffffff, 2.5);
    key.position.set(5, 9.5, 6);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.camera.near = 2;
    key.shadow.camera.far = 32;
    key.shadow.camera.left = -7;
    key.shadow.camera.right = 7;
    key.shadow.camera.top = 7;
    key.shadow.camera.bottom = -7;
    key.shadow.bias = -0.0012;
    key.shadow.radius = 2.5;
    scene.add(key);

    const fill = new THREE.DirectionalLight(0xdfe6ff, 0.85);
    fill.position.set(-7, 4, -5);
    scene.add(fill);

    const rim = new THREE.DirectionalLight(0xffffff, 0.5);
    rim.position.set(0, -7, -6);
    scene.add(rim);

    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(60, 60),
      new THREE.ShadowMaterial({ opacity: 0.28 }),
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -1.24;
    ground.receiveShadow = true;
    scene.add(ground);

    const fit = () => {
      const half = focusRef.current;
      const vertical = (half / Math.tan((camera.fov * Math.PI) / 360)) * 1.02;
      const distance = camera.aspect < 1 ? vertical / camera.aspect : vertical;

      const direction = camera.position.clone().sub(controls.target);
      if (direction.lengthSq() < 1e-6) direction.set(0, 0.58, 1);
      direction.normalize();

      camera.position.copy(controls.target).add(direction.multiplyScalar(distance));
      controls.minDistance = distance * 0.6;
      controls.maxDistance = distance * 2.2;
      controls.update();
    };

    const handle: SceneHandle = { scene, camera, controls, renderer, group: null, fit };
    sceneRef.current = handle;

    const resize = () => {
      const rect = mount.getBoundingClientRect();
      if (rect.width < 2 || rect.height < 2) return;
      renderer.setSize(rect.width, rect.height, false);
      camera.aspect = rect.width / rect.height;
      camera.updateProjectionMatrix();
      fit();
    };

    const observer = new ResizeObserver(resize);
    observer.observe(mount);
    resize();

    renderer.setAnimationLoop(() => {
      if (document.hidden) return;
      controls.update();
      renderer.render(scene, camera);
    });

    return () => {
      renderer.setAnimationLoop(null);
      observer.disconnect();
      controls.dispose();
      if (handle.group) {
        scene.remove(handle.group);
        disposeObject(handle.group);
      }
      disposeObject(scene);
      environment.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      canvas.remove();
      sceneRef.current = null;
    };
  }, []);

  /* --------------------------- rebuild on config -------------------------- */

  useEffect(() => {
    const handle = sceneRef.current;
    if (!handle) return;

    const group = createWatch(build);
    handle.scene.add(group);
    handle.group = group;

    // Frame the case, not the whole group — a curled bracelet should be allowed
    // to run past the edges of the viewport.
    focusRef.current = (build.caseSize / 20) * 1.5 + 0.42;
    handle.fit();
    setReady(true);

    return () => {
      handle.scene.remove(group);
      disposeObject(group);
      if (handle.group === group) handle.group = null;
    };
  }, [build]);

  useEffect(() => {
    const handle = sceneRef.current;
    if (handle) handle.controls.autoRotate = autoRotate;
  }, [autoRotate]);

  /* -------------------------------- actions ------------------------------- */

  const resetView = useCallback(() => {
    const handle = sceneRef.current;
    if (!handle) return;
    const camera = handle.camera;
    handle.controls.target.set(0, -0.3, 0);
    camera.position.set(0, 6.2, 9.4);
    handle.fit();
  }, []);

  const addToBag = useCallback(() => {
    setBag((previous) => previous + 1);
    setJustAdded(true);
  }, []);

  const strapIsBracelet = build.strap === 'bracelet';

  return (
    <div className="flex h-full min-h-0 flex-col bg-bg text-fg">
      <header className="flex h-12 shrink-0 items-center gap-3 border-b border-border bg-surface px-4">
        <span
          aria-hidden="true"
          className="flex size-6 items-center justify-center rounded-md bg-brand-600 text-[11px] font-extrabold text-fg-on-brand"
        >
          O
        </span>
        <span className="text-sm font-semibold tracking-tight">Orbit</span>
        <span className="hidden text-xs text-fg-subtle sm:inline">Atelier configurator</span>

        <div className="ml-auto flex items-center gap-3">
          {bag > 0 ? (
            <Badge tone="success" size="sm" startIcon={<CheckIcon />}>
              {bag} in bag
            </Badge>
          ) : null}
          <span className="text-sm font-semibold tabular-nums text-fg">{usd.format(price.total)}</span>
          <Button size="sm" onClick={addToBag} startIcon={<SparklesIcon />}>
            Add to bag
          </Button>
        </div>
      </header>

      <div className="grid min-h-0 flex-1 grid-cols-[286px_minmax(0,1fr)_330px] divide-x divide-border overflow-hidden">
        {/* Options */}
        <div className="flex min-h-0 flex-col gap-5 overflow-y-auto bg-surface p-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-sm font-semibold tracking-tight text-fg">Orbit Chronograph</h1>
            <p className="text-xs leading-5 text-fg-subtle">
              40 mm automatic chronograph, in-house calibre. Build it, then send it to the bench.
            </p>
          </div>

          <OptionGroup title="Case material">
            {CASE_MATERIALS.map((option) => (
              <OptionRow
                key={option.id}
                active={build.caseMaterial === option.id}
                onClick={() => set('caseMaterial', option.id)}
                price={option.price}
                leading={<span aria-hidden="true" className={cn('size-5 rounded-full border border-border', option.chip)} />}
                label={option.label}
                note={option.note}
              />
            ))}
          </OptionGroup>

          <OptionGroup title="Case size">
            {CASE_SIZES.map((option) => (
              <OptionRow
                key={option.value}
                active={build.caseSize === option.value}
                onClick={() => set('caseSize', option.value)}
                price={option.price}
                label={option.label}
                note={option.note}
              />
            ))}
          </OptionGroup>

          <OptionGroup title="Dial">
            <div className="grid grid-cols-3 gap-2">
              {DIALS.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  aria-pressed={build.dial === option.id}
                  onClick={() => set('dial', option.id)}
                  className={cn(
                    'flex flex-col items-center gap-1.5 rounded-lg border p-2 transition-colors',
                    build.dial === option.id
                      ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-950/40'
                      : 'border-border hover:border-border-strong',
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn('size-7 rounded-full border border-border shadow-xs', option.chip)}
                  />
                  <span className="text-center text-[10px] leading-3 text-fg-muted">{option.label}</span>
                </button>
              ))}
            </div>
          </OptionGroup>

          <OptionGroup title="Bezel">
            {BEZELS.map((option) => (
              <OptionRow
                key={option.id}
                active={build.bezel === option.id}
                onClick={() => set('bezel', option.id)}
                price={option.price}
                label={option.label}
                note={option.note}
              />
            ))}
          </OptionGroup>

          <OptionGroup title="Strap">
            {STRAPS.map((option) => (
              <OptionRow
                key={option.id}
                active={build.strap === option.id}
                onClick={() => set('strap', option.id)}
                price={option.price}
                label={option.label}
                note={option.note}
              />
            ))}
          </OptionGroup>

          <OptionGroup title="Strap colour">
            {strapIsBracelet ? (
              <p className="rounded-lg border border-dashed border-border px-3 py-2 text-[11px] leading-4 text-fg-subtle">
                Bracelets are finished in the case metal. Pick another strap to choose a leather,
                rubber, or nylon colour.
              </p>
            ) : null}
            <div className={cn('grid grid-cols-3 gap-2', strapIsBracelet && 'pointer-events-none opacity-40')}>
              {STRAP_COLORS.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  disabled={strapIsBracelet}
                  aria-pressed={build.strapColor === option.id}
                  onClick={() => set('strapColor', option.id)}
                  className={cn(
                    'flex flex-col items-center gap-1.5 rounded-lg border p-2 transition-colors',
                    build.strapColor === option.id
                      ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-950/40'
                      : 'border-border hover:border-border-strong',
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn('size-7 rounded-full border border-border shadow-xs', option.chip)}
                  />
                  <span className="text-center text-[10px] leading-3 text-fg-muted">{option.label}</span>
                </button>
              ))}
            </div>
          </OptionGroup>
        </div>

        {/* Viewport */}
        <div ref={mountRef} className="relative min-h-0 overflow-hidden bg-surface-sunken">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_35%,var(--color-surface),var(--color-surface-sunken))]"
          />
          <div ref={canvasHostRef} className="absolute inset-0" />

          {!ready && !error ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
              <Spinner size="lg" />
              <p className="text-sm text-fg-subtle">Building the scene…</p>
            </div>
          ) : null}

          {error ? (
            <div className="absolute inset-x-6 top-6">
              <Alert tone="danger" title="3D preview unavailable">
                {error}
              </Alert>
            </div>
          ) : null}

          <div className="absolute inset-x-4 bottom-4 flex flex-wrap items-center gap-2">
            <div className="rounded-full border border-border bg-surface/85 px-3 py-1.5 text-[11px] text-fg-subtle backdrop-blur">
              Drag to orbit · scroll to zoom
            </div>
            <div className="ml-auto flex items-center gap-2">
              <Button
                size="sm"
                variant="secondary"
                aria-pressed={autoRotate}
                onClick={() => setAutoRotate((previous) => !previous)}
              >
                {autoRotate ? 'Stop spin' : 'Auto spin'}
              </Button>
              <Button size="sm" variant="secondary" startIcon={<RefreshIcon />} onClick={resetView}>
                Reset view
              </Button>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="flex min-h-0 flex-col overflow-y-auto bg-surface">
          <section className="border-b border-border p-4">
            <h2 className="text-[11px] font-semibold tracking-wide text-fg-subtle uppercase">Your build</h2>
            <p className="mt-2 text-xs leading-5 text-fg-muted">{summary}</p>
            <div className="mt-3 flex items-center gap-2">
              <CopyButton value={summary} label="Copy configuration" size="sm" />
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setSaved(true)}
                aria-pressed={saved}
              >
                {saved ? 'Saved' : 'Save build'}
              </Button>
            </div>
          </section>

          <section className="border-b border-border p-4">
            <h2 className="text-[11px] font-semibold tracking-wide text-fg-subtle uppercase">Price</h2>
            <dl className="mt-3 flex flex-col gap-2 text-xs">
              <PriceRow label={`Orbit Chronograph, ${build.caseSize} mm`} value={usd.format(BASE_PRICE)} />
              {price.material !== 0 ? (
                <PriceRow label={find(CASE_MATERIALS, build.caseMaterial).label} value={usd.format(price.material)} />
              ) : null}
              {price.size !== 0 ? (
                <PriceRow label="Case size surcharge" value={usd.format(price.size)} />
              ) : null}
              {price.bezel !== 0 ? (
                <PriceRow label={`${find(BEZELS, build.bezel).label} bezel`} value={usd.format(price.bezel)} />
              ) : null}
              {price.strap !== 0 ? (
                <PriceRow label={`${find(STRAPS, build.strap).label} strap`} value={usd.format(price.strap)} />
              ) : null}
              <div className="mt-1 flex items-baseline justify-between gap-3 border-t border-border pt-2">
                <dt className="text-sm font-semibold text-fg">Total</dt>
                <dd className="text-sm font-semibold tabular-nums text-fg">{usd.format(price.total)}</dd>
              </div>
            </dl>
            <p className="mt-2 text-[11px] text-fg-subtle">
              Includes duties to the US and EU. Hong Kong and Singapore settle at checkout.
            </p>
          </section>

          <section className="border-b border-border p-4">
            <h2 className="text-[11px] font-semibold tracking-wide text-fg-subtle uppercase">Specification</h2>
            <dl className="mt-3 flex flex-col gap-2 text-xs">
              {specs.map(([term, value]) => (
                <div key={term} className="flex items-baseline justify-between gap-3">
                  <dt className="shrink-0 text-fg-muted">{term}</dt>
                  <dd className="text-right text-fg">{value}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="border-b border-border p-4">
            <h2 className="text-[11px] font-semibold tracking-wide text-fg-subtle uppercase">Delivery</h2>
            <ul className="mt-3 flex flex-col gap-2 text-xs">
              <li className="flex items-baseline justify-between gap-3">
                <span className="text-fg-muted">Assembled by hand</span>
                <span className="text-fg">3 working days</span>
              </li>
              <li className="flex items-baseline justify-between gap-3">
                <span className="text-fg-muted">Estimated arrival</span>
                <span className="text-fg">{leadDate}</span>
              </li>
              <li className="flex items-baseline justify-between gap-3">
                <span className="text-fg-muted">Returns</span>
                <span className="text-fg">30 days, free</span>
              </li>
            </ul>
          </section>

          <section className="mt-auto flex flex-col gap-3 p-4">
            <Button onClick={addToBag} startIcon={<SparklesIcon />} fullWidth>
              Add to bag · {usd.format(price.total)}
            </Button>
            {justAdded ? (
              <Alert tone="success" title="Added to your bag">
                {summary}
              </Alert>
            ) : (
              <p className="text-[11px] leading-5 text-fg-subtle">
                Every build is assembled to order in Le Locle and engraved with its own reference
                number on the case back.
              </p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------- sub-components ----------------------------- */

function OptionGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-[11px] font-semibold tracking-wide text-fg-subtle uppercase">{title}</h2>
      <div className="flex flex-col gap-1.5">{children}</div>
    </section>
  );
}

function OptionRow({
  active,
  onClick,
  label,
  note,
  price,
  leading,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  note: string;
  price: number;
  leading?: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        'flex items-center gap-2.5 rounded-lg border px-2.5 py-2 text-left transition-colors',
        active
          ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-950/40'
          : 'border-border hover:border-border-strong',
      )}
    >
      {leading}
      <span className="min-w-0 flex-1">
        <span className={cn('block truncate text-xs', active ? 'font-semibold text-fg' : 'text-fg')}>
          {label}
        </span>
        <span className="block truncate text-[10px] leading-4 text-fg-subtle">{note}</span>
      </span>
      <span className="shrink-0 text-[10px] tabular-nums text-fg-subtle">
        {price === 0 ? 'included' : price > 0 ? `+${usd.format(price)}` : `−${usd.format(Math.abs(price))}`}
      </span>
    </button>
  );
}

function PriceRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-fg-muted">{label}</dt>
      <dd className="tabular-nums text-fg">{value}</dd>
    </div>
  );
}
