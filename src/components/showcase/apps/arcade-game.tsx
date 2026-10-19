'use client';

import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { cn } from '@/lib/cn';
import { mulberry32 } from '@/lib/random';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Kbd } from '@/components/ui/code';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import {
  BoltIcon,
  GaugeIcon,
  HeartIcon,
  KeyboardIcon,
  StarIcon,
} from '@/components/ui/icons';

const CONTROLS: { keys: string[]; action: string }[] = [
  { keys: ['Pointer'], action: 'Move the paddle' },
  { keys: ['←', '→'], action: 'Nudge the paddle' },
  { keys: ['A', 'D'], action: 'Nudge the paddle' },
  { keys: ['Space'], action: 'Serve · pause' },
  { keys: ['P'], action: 'Pause' },
  { keys: ['R'], action: 'Restart' },
  { keys: ['M'], action: 'Mute' },
];

/* ------------------------------- game model -------------------------------- */

type Phase = 'ready' | 'playing' | 'paused' | 'level-clear' | 'game-over';

interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
}

interface Brick {
  x: number;
  y: number;
  w: number;
  h: number;
  row: number;
  col: number;
  hp: number;
  maxHp: number;
  dead: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  tone: Tone;
}

type PowerKind = 'wide' | 'multi' | 'slow';
type Tone = 'danger' | 'warning' | 'success' | 'info' | 'brand' | 'accent';

interface PowerUp {
  x: number;
  y: number;
  vy: number;
  kind: PowerKind;
  spin: number;
}

interface Game {
  phase: Phase;
  level: number;
  score: number;
  best: number;
  combo: number;
  bestCombo: number;
  lives: number;
  balls: Ball[];
  bricks: Brick[];
  particles: Particle[];
  powerUps: PowerUp[];
  trail: { x: number; y: number }[];
  paddleX: number;
  paddleW: number;
  basePaddleW: number;
  pointerX: number | null;
  keys: { left: boolean; right: boolean };
  shake: number;
  flash: number;
  time: number;
  wideFor: number;
  slowFor: number;
  bricksBroken: number;
  powerUpsCollected: number;
  muted: boolean;
}

const COLS = 11;
const ROWS = 6;
const ROW_TONES: Tone[] = ['danger', 'warning', 'success', 'info', 'brand', 'accent'];
const BRICK_GAP = 6;
const BRICK_H = 22;
const FIELD_TOP = 56;
const PADDLE_H = 12;
const PADDLE_BOTTOM = 46;
const MAX_SPEED = 760;

const POWER_LABEL: Record<PowerKind, string> = { wide: 'W', multi: 'M', slow: 'S' };
const POWER_NAME: Record<PowerKind, string> = {
  wide: 'Wider paddle',
  multi: 'Multiball',
  slow: 'Slow motion',
};

/* ------------------------------- palette ----------------------------------- */

interface Palette {
  bg: string;
  surface: string;
  fg: string;
  fgMuted: string;
  border: string;
  brand: string;
  brandStrong: string;
  accent: string;
  success: string;
  warning: string;
  danger: string;
  info: string;
}

/**
 * The canvas has no Tailwind, so it paints with the same custom properties the
 * stylesheet does. Reading them at paint time means the game re-themes with the
 * rest of the site instead of hard-coding a neon palette.
 */
function readPalette(element: HTMLElement): Palette {
  const styles = getComputedStyle(element);
  const get = (name: string, fallback: string) => styles.getPropertyValue(name).trim() || fallback;
  return {
    bg: get('--color-bg', '#0b0b14'),
    surface: get('--color-surface', '#141422'),
    fg: get('--color-fg', '#f4f4fb'),
    fgMuted: get('--color-fg-muted', '#a9a9c4'),
    border: get('--color-border', '#2a2a3d'),
    brand: get('--color-brand-500', '#6366f1'),
    brandStrong: get('--color-brand-600', '#4f46e5'),
    accent: get('--color-brand-800', '#312e81'),
    success: get('--color-success', '#22c55e'),
    warning: get('--color-warning', '#f59e0b'),
    danger: get('--color-danger', '#ef4444'),
    info: get('--color-info', '#38bdf8'),
  };
}

/* --------------------------------- audio ----------------------------------- */

/** A handful of oscillator blips — no audio files, no dependency. */
class Blips {
  private context: AudioContext | null = null;
  muted = false;

  private ensure(): AudioContext | null {
    if (typeof window === 'undefined' || this.muted) return null;
    if (!this.context) {
      try {
        this.context = new AudioContext();
      } catch {
        return null;
      }
    }
    if (this.context.state === 'suspended') void this.context.resume();
    return this.context;
  }

  private tone(from: number, to: number, duration: number, type: OscillatorType, gain: number) {
    const context = this.ensure();
    if (!context) return;

    const now = context.currentTime;
    const oscillator = context.createOscillator();
    const amp = context.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(from, now);
    if (to !== from) oscillator.frequency.exponentialRampToValueAtTime(Math.max(1, to), now + duration);

    amp.gain.setValueAtTime(gain, now);
    amp.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    oscillator.connect(amp).connect(context.destination);
    oscillator.start(now);
    oscillator.stop(now + duration + 0.02);
  }

  brick(combo: number) {
    this.tone(360 + Math.min(10, combo) * 34, 520 + Math.min(10, combo) * 40, 0.07, 'square', 0.035);
  }

  paddle() {
    this.tone(210, 170, 0.08, 'triangle', 0.05);
  }

  wall() {
    this.tone(300, 300, 0.035, 'sine', 0.02);
  }

  power() {
    this.tone(520, 1180, 0.18, 'sawtooth', 0.03);
  }

  serve() {
    this.tone(180, 420, 0.12, 'triangle', 0.045);
  }

  lose() {
    this.tone(320, 70, 0.5, 'sawtooth', 0.05);
  }

  clear() {
    const notes = [523, 659, 784, 1046];
    notes.forEach((note, index) => {
      window.setTimeout(() => this.tone(note, note, 0.16, 'square', 0.035), index * 90);
    });
  }

  over() {
    const notes = [392, 330, 262, 196];
    notes.forEach((note, index) => {
      window.setTimeout(() => this.tone(note, note, 0.28, 'triangle', 0.045), index * 150);
    });
  }
}

/* ------------------------------- level layout ------------------------------ */

interface BrickSpec {
  row: number;
  col: number;
  hp: number;
}

/** The brick pattern depends only on the level, so a resize never rerolls it. */
function patternFor(level: number): BrickSpec[] {
  const next = mulberry32(0x5eed + level * 7919);
  const specs: BrickSpec[] = [];
  // Grids get denser each level, and the third row turns armoured from level 3.
  const bonus = Math.min(0.06, (level - 1) * 0.02);
  const armouredRows = level >= 3 ? 3 : 2;

  for (let row = 0; row < ROWS; row += 1) {
    const density = Math.min(0.98, 0.72 + (ROWS - row) * 0.04 + bonus);
    for (let col = 0; col < COLS; col += 1) {
      if (next() > density) continue;
      specs.push({ row, col, hp: row < armouredRows ? 2 : 1 });
    }
  }

  return specs;
}

function layoutBricks(specs: BrickSpec[], width: number): Brick[] {
  const margin = Math.max(16, width * 0.03);
  const usable = width - margin * 2 - BRICK_GAP * (COLS - 1);
  const brickW = usable / COLS;

  return specs.map((spec) => ({
    x: margin + spec.col * (brickW + BRICK_GAP),
    y: FIELD_TOP + spec.row * (BRICK_H + BRICK_GAP),
    w: brickW,
    h: BRICK_H,
    row: spec.row,
    col: spec.col,
    hp: spec.hp,
    maxHp: spec.hp,
    dead: false,
  }));
}

/* --------------------------------- helpers --------------------------------- */

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

function baseSpeedFor(level: number) {
  return Math.min(520, 300 + (level - 1) * 26);
}

function serveBall(game: Game, width: number, height: number): Ball {
  const speed = baseSpeedFor(game.level);
  const angle = (-58 + 116 * Math.random()) * (Math.PI / 180);
  return {
    x: game.paddleX + game.paddleW / 2,
    y: height - PADDLE_BOTTOM - PADDLE_H - 12,
    vx: Math.sin(angle) * speed,
    vy: -Math.abs(Math.cos(angle) * speed),
    r: 7,
  };
}

function createGame(width: number, best: number, muted: boolean): Game {
  const game: Game = {
    phase: 'ready',
    level: 1,
    score: 0,
    best,
    combo: 1,
    bestCombo: 1,
    lives: 3,
    balls: [],
    bricks: [],
    particles: [],
    powerUps: [],
    trail: [],
    paddleX: width / 2 - 60,
    paddleW: 120,
    basePaddleW: 120,
    pointerX: null,
    keys: { left: false, right: false },
    shake: 0,
    flash: 0,
    time: 0,
    wideFor: 0,
    slowFor: 0,
    bricksBroken: 0,
    powerUpsCollected: 0,
    muted,
  };
  startLevel(game, width);
  return game;
}

function startLevel(game: Game, width: number) {
  game.bricks = layoutBricks(patternFor(game.level), width);
  game.powerUps = [];
  game.particles = [];
  game.trail = [];
  game.balls = [];
  game.combo = 1;
  game.wideFor = 0;
  game.slowFor = 0;
  game.paddleW = game.basePaddleW;
  game.paddleX = width / 2 - game.paddleW / 2;
  game.phase = 'ready';
}

/** Freeze-time housekeeping: a shake that outlives the pause looks like a bug. */
function settle(game: Game) {
  game.shake = 0;
}

/* ------------------------------- component --------------------------------- */

interface Hud {
  phase: Phase;
  score: number;
  best: number;
  lives: number;
  level: number;
  combo: number;
  bestCombo: number;
  bricksBroken: number;
  powerUpsCollected: number;
  /** Bricks still standing, and the size of this level's grid. */
  remaining: number;
  total: number;
}

export function ArcadeGame() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sizeRef = useRef({ w: 900, h: 560 });
  const paletteRef = useRef<Palette | null>(null);
  const blipsRef = useRef<Blips | null>(null);
  const gameRef = useRef<Game | null>(null);
  const mutedRef = useRef(false);

  const [hud, setHud] = useState<Hud>({
    phase: 'ready',
    score: 0,
    best: 0,
    lives: 3,
    level: 1,
    combo: 1,
    bestCombo: 1,
    bricksBroken: 0,
    powerUpsCollected: 0,
    remaining: 0,
    total: 0,
  });
  const [muted, setMuted] = useState(false);

  const syncHud = useCallback(() => {
    const game = gameRef.current;
    if (!game) return;
    setHud((previous) => {
      const next: Hud = {
        phase: game.phase,
        score: game.score,
        best: game.best,
        lives: game.lives,
        level: game.level,
        combo: game.combo,
        bestCombo: game.bestCombo,
        bricksBroken: game.bricksBroken,
        powerUpsCollected: game.powerUpsCollected,
        remaining: game.bricks.reduce((sum, brick) => sum + (brick.dead ? 0 : 1), 0),
        total: game.bricks.length,
      };
      const changed = (Object.keys(next) as (keyof Hud)[]).some((key) => previous[key] !== next[key]);
      return changed ? next : previous;
    });
  }, []);

  const setPhase = useCallback(
    (phase: Phase) => {
      const game = gameRef.current;
      if (!game) return;
      game.phase = phase;
      if (phase !== 'playing') settle(game);
      syncHud();
    },
    [syncHud],
  );

  const restart = useCallback(() => {
    const { w } = sizeRef.current;
    const best = gameRef.current?.best ?? 0;
    gameRef.current = createGame(w, best, mutedRef.current);
    syncHud();
  }, [syncHud]);

  const nextLevel = useCallback(() => {
    const game = gameRef.current;
    if (!game) return;
    const { w } = sizeRef.current;
    game.level += 1;
    startLevel(game, w);
    syncHud();
  }, [syncHud]);

  const togglePause = useCallback(() => {
    const game = gameRef.current;
    if (!game) return;
    if (game.phase === 'playing') setPhase('paused');
    else if (game.phase === 'paused') setPhase('playing');
    else if (game.phase === 'ready') setPhase('playing');
  }, [setPhase]);

  const setMute = useCallback((next: boolean) => {
    setMuted(next);
    mutedRef.current = next;
    const game = gameRef.current;
    if (game) game.muted = next;
    if (blipsRef.current) blipsRef.current.muted = next;
  }, []);

  const toggleMute = useCallback(() => setMute(!mutedRef.current), [setMute]);

  /* ------------------------------ the loop --------------------------------- */

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (!blipsRef.current) blipsRef.current = new Blips();
    blipsRef.current.muted = mutedRef.current;
    paletteRef.current = readPalette(canvas);

    let best = 0;
    try {
      best = Number(window.localStorage.getItem('flinchui.arcade.best') ?? 0) || 0;
    } catch {
      best = 0;
    }

    const { w } = sizeRef.current;
    gameRef.current = createGame(w, best, mutedRef.current);
    syncHud();

    let frame = 0;
    let last = performance.now();

    const resize = () => {
      const rect = container.getBoundingClientRect();
      if (rect.width < 2 || rect.height < 2) return;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const previous = sizeRef.current;
      sizeRef.current = { w: rect.width, h: rect.height };

      const game = gameRef.current;
      if (game) {
        // Relayout the same pattern so a resize never rerolls hp or geometry
        // out from under the player.
        const specs = patternFor(game.level);
        const fresh = layoutBricks(specs, rect.width);
        game.bricks = fresh.map((brick, index) => ({
          ...brick,
          hp: Math.min(brick.maxHp, game.bricks[index]?.hp ?? brick.maxHp),
          dead: game.bricks[index]?.dead ?? false,
        }));
        const scale = previous.w > 2 ? rect.width / previous.w : 1;
        game.paddleX = clamp(game.paddleX * scale, 0, rect.width - game.paddleW);
      }
    };

    resize();

    const themeObserver = new MutationObserver(() => {
      paletteRef.current = readPalette(canvas);
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'class'] });

    const sizeObserver = new ResizeObserver(resize);
    sizeObserver.observe(container);

    /* -------------------------------- input -------------------------------- */

    const onKeyDown = (event: KeyboardEvent) => {
      const game = gameRef.current;
      if (!game) return;
      const key = event.key.toLowerCase();

      if (key === ' ' || key === 'arrowleft' || key === 'arrowright' || key === 'arrowup' || key === 'arrowdown') {
        event.preventDefault();
      }

      if (key === 'arrowleft' || key === 'a') game.keys.left = true;
      if (key === 'arrowright' || key === 'd') game.keys.right = true;
      if (key === 'm') toggleMute();

      if (key === ' ' || key === 'enter') {
        if (game.phase === 'ready') {
          const { w, h } = sizeRef.current;
          game.balls = [serveBall(game, w, h)];
          game.phase = 'playing';
          blipsRef.current?.serve();
          syncHud();
        } else if (game.phase === 'playing' || game.phase === 'paused') {
          togglePause();
        } else if (game.phase === 'level-clear') {
          nextLevel();
        }
      }

      if (key === 'p') togglePause();
      if (key === 'r') restart();
    };

    const onKeyUp = (event: KeyboardEvent) => {
      const game = gameRef.current;
      if (!game) return;
      const key = event.key.toLowerCase();
      if (key === 'arrowleft' || key === 'a') game.keys.left = false;
      if (key === 'arrowright' || key === 'd') game.keys.right = false;
    };

    const onVisibility = () => {
      const game = gameRef.current;
      if (game && document.hidden && game.phase === 'playing') {
        game.phase = 'paused';
        syncHud();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    document.addEventListener('visibilitychange', onVisibility);

    /* -------------------------------- update ------------------------------- */

    const spawnParticles = (x: number, y: number, tone: Tone, count: number) => {
      const game = gameRef.current!;
      for (let index = 0; index < count; index += 1) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 60 + Math.random() * 220;
        game.particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 60,
          life: 0.4 + Math.random() * 0.5,
          maxLife: 0.9,
          size: 2 + Math.random() * 3,
          tone,
        });
      }
      if (game.particles.length > 420) game.particles.splice(0, game.particles.length - 420);
    };

    const destroyBrick = (game: Game, brick: Brick) => {
      brick.dead = true;
      game.bricksBroken += 1;
      game.combo = Math.min(24, game.combo + 1);
      game.bestCombo = Math.max(game.bestCombo, game.combo);
      game.score += 100 * game.combo;
      spawnParticles(brick.x + brick.w / 2, brick.y + brick.h / 2, ROW_TONES[brick.row]!, 12);
      blipsRef.current?.brick(game.combo);

      if (Math.random() < 0.14) {
        const kinds: PowerKind[] = ['wide', 'multi', 'slow'];
        game.powerUps.push({
          x: brick.x + brick.w / 2,
          y: brick.y + brick.h / 2,
          vy: 92,
          kind: kinds[Math.floor(Math.random() * kinds.length)]!,
          spin: 0,
        });
      }
    };

    const reflectBrick = (ball: Ball, brick: Brick) => {
      const overlapX = ball.r + brick.w / 2 - Math.abs(ball.x - (brick.x + brick.w / 2));
      const overlapY = ball.r + brick.h / 2 - Math.abs(ball.y - (brick.y + brick.h / 2));
      if (overlapX <= 0 || overlapY <= 0) return false;

      if (overlapX < overlapY) {
        ball.vx = -ball.vx;
        ball.x += ball.x < brick.x + brick.w / 2 ? -overlapX : overlapX;
      } else {
        ball.vy = -ball.vy;
        ball.y += ball.y < brick.y + brick.h / 2 ? -overlapY : overlapY;
      }
      return true;
    };

    const stepBall = (game: Game, ball: Ball, dt: number, width: number, height: number) => {
      const speed = Math.hypot(ball.vx, ball.vy);
      if (speed > MAX_SPEED) {
        ball.vx = (ball.vx / speed) * MAX_SPEED;
        ball.vy = (ball.vy / speed) * MAX_SPEED;
      }
      const travel = speed * dt;
      const steps = clamp(Math.ceil(travel / (ball.r * 0.7)), 1, 8);
      const slice = dt / steps;

      for (let step = 0; step < steps; step += 1) {
        ball.x += ball.vx * slice;
        ball.y += ball.vy * slice;

        if (ball.x - ball.r < 0) {
          ball.x = ball.r;
          ball.vx = Math.abs(ball.vx);
          blipsRef.current?.wall();
        } else if (ball.x + ball.r > width) {
          ball.x = width - ball.r;
          ball.vx = -Math.abs(ball.vx);
          blipsRef.current?.wall();
        }
        if (ball.y - ball.r < 0) {
          ball.y = ball.r;
          ball.vy = Math.abs(ball.vy);
          blipsRef.current?.wall();
        }

        // Paddle
        const paddleY = height - PADDLE_BOTTOM - PADDLE_H;
        if (
          ball.vy > 0 &&
          ball.y + ball.r >= paddleY &&
          ball.y + ball.r <= paddleY + PADDLE_H + 10 &&
          ball.x >= game.paddleX - ball.r &&
          ball.x <= game.paddleX + game.paddleW + ball.r
        ) {
          const centre = game.paddleX + game.paddleW / 2;
          const offset = clamp((ball.x - centre) / (game.paddleW / 2), -1, 1);
          const angle = offset * (Math.PI / 3);
          const next = Math.min(MAX_SPEED, Math.max(baseSpeedFor(game.level), speed) * 1.015);
          ball.vx = Math.sin(angle) * next;
          ball.vy = -Math.abs(Math.cos(angle) * next);
          ball.y = paddleY - ball.r - 0.5;
          game.combo = 1;
          game.paddleW = game.wideFor > 0 ? game.basePaddleW * 1.5 : game.basePaddleW;
          game.shake = Math.min(6, game.shake + 2);
          blipsRef.current?.paddle();
        }

        // Bricks — resolve at most two collisions per slice for stability.
        let resolved = 0;
        for (const brick of game.bricks) {
          if (brick.dead) continue;
          if (!reflectBrick(ball, brick)) continue;
          resolved += 1;
          if (brick.hp > 1) {
            brick.hp -= 1;
            game.score += 25;
            spawnParticles(ball.x, ball.y, ROW_TONES[brick.row]!, 4);
            game.shake = Math.min(6, game.shake + 1.5);
          } else {
            destroyBrick(game, brick);
            game.shake = Math.min(8, game.shake + 3);
          }
          if (resolved >= 2) break;
        }
      }
    };

    const update = (game: Game, dt: number, width: number, height: number) => {
      game.time += dt;

      if (game.shake > 0) game.shake = Math.max(0, game.shake - dt * 26);
      if (game.flash > 0) game.flash = Math.max(0, game.flash - dt * 3);

      if (game.phase === 'ready') {
        game.paddleW = game.basePaddleW;
        if (game.pointerX !== null) game.paddleX = game.pointerX - game.paddleW / 2;
        if (game.keys.left) game.paddleX -= 620 * dt;
        if (game.keys.right) game.paddleX += 620 * dt;
        game.paddleX = clamp(game.paddleX, 0, width - game.paddleW);
        return;
      }

      if (game.phase !== 'playing') return;

      // Effects
      if (game.wideFor > 0) {
        game.wideFor = Math.max(0, game.wideFor - dt);
        game.paddleW = game.basePaddleW * 1.5;
      } else {
        game.paddleW = game.basePaddleW;
      }
      if (game.slowFor > 0) game.slowFor = Math.max(0, game.slowFor - dt);

      // Paddle
      if (game.pointerX !== null) {
        const target = game.pointerX - game.paddleW / 2;
        game.paddleX += (target - game.paddleX) * Math.min(1, dt * 22);
      }
      if (game.keys.left) game.paddleX -= 700 * dt;
      if (game.keys.right) game.paddleX += 700 * dt;
      game.paddleX = clamp(game.paddleX, 0, width - game.paddleW);

      // Balls
      const survivors: Ball[] = [];
      for (const ball of game.balls) {
        stepBall(game, ball, dt, width, height);
        if (ball.y - ball.r > height + 30) continue;
        survivors.push(ball);
      }

      if (survivors.length !== game.balls.length) {
        game.combo = 1;
        game.trail = [];
        if (survivors.length === 0) {
          game.lives -= 1;
          game.wideFor = 0;
          game.slowFor = 0;
          game.phase = 'ready';
          game.shake = 10;
          if (game.lives <= 0) {
            game.phase = 'game-over';
            if (game.score > game.best) {
              game.best = game.score;
              try {
                window.localStorage.setItem('flinchui.arcade.best', String(game.best));
              } catch {
                /* storage is optional */
              }
            }
            blipsRef.current?.over();
          } else {
            blipsRef.current?.lose();
          }
          syncHud();
        }
      }
      game.balls = survivors;

      // Trail
      const lead = game.balls[0];
      if (lead) {
        game.trail.push({ x: lead.x, y: lead.y });
        if (game.trail.length > 14) game.trail.shift();
      }

      // Power-ups
      game.powerUps = game.powerUps.filter((power) => {
        power.y += power.vy * dt;
        power.spin += dt * 3;
        const paddleY = height - PADDLE_BOTTOM - PADDLE_H;
        if (
          power.y + 12 >= paddleY &&
          power.y - 12 <= paddleY + PADDLE_H &&
          power.x >= game.paddleX - 12 &&
          power.x <= game.paddleX + game.paddleW + 12
        ) {
          game.powerUpsCollected += 1;
          game.score += 150;
          blipsRef.current?.power();
          game.flash = 0.6;
          if (power.kind === 'wide') game.wideFor = 14;
          if (power.kind === 'slow') {
            game.slowFor = 8;
            for (const ball of game.balls) {
              ball.vx *= 0.72;
              ball.vy *= 0.72;
            }
          }
          if (power.kind === 'multi' && game.balls.length < 6) {
            const source = game.balls[0];
            if (source) {
              for (const spread of [-0.42, 0.42]) {
                game.balls.push({
                  x: source.x,
                  y: source.y,
                  vx: source.vx * Math.cos(spread) - source.vy * Math.sin(spread),
                  vy: source.vx * Math.sin(spread) + source.vy * Math.cos(spread),
                  r: source.r,
                });
              }
            }
          }
          return false;
        }
        return power.y < height + 30;
      });

      // Particles
      for (const particle of game.particles) {
        particle.vy += 900 * dt;
        particle.x += particle.vx * dt;
        particle.y += particle.vy * dt;
        particle.life -= dt;
      }
      game.particles = game.particles.filter((particle) => particle.life > 0);

      // Level clear
      if (!game.bricks.some((brick) => !brick.dead)) {
        game.phase = 'level-clear';
        game.score += 500 * game.level;
        game.flash = 1;
        blipsRef.current?.clear();
        syncHud();
      }
    };

    /* -------------------------------- render ------------------------------- */

    const roundRect = (x: number, y: number, w: number, h: number, r: number) => {
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, r);
    };

    const draw = (game: Game, width: number, height: number) => {
      const palette = paletteRef.current ?? readPalette(canvas);

      ctx.save();
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = palette.bg;
      ctx.fillRect(0, 0, width, height);

      // Backdrop dot grid.
      ctx.fillStyle = palette.border;
      ctx.globalAlpha = 0.5;
      for (let x = 24; x < width; x += 32) {
        for (let y = 24; y < height; y += 32) {
          ctx.fillRect(x, y, 1.5, 1.5);
        }
      }
      ctx.globalAlpha = 1;

      if (game.shake > 0) {
        ctx.translate((Math.random() - 0.5) * game.shake, (Math.random() - 0.5) * game.shake);
      }

      // Bricks
      for (const brick of game.bricks) {
        if (brick.dead) continue;
        const tone = ROW_TONES[brick.row]!;
        const colour = palette[tone];
        const armoured = brick.maxHp > 1;

        ctx.globalAlpha = armoured && brick.hp === 1 ? 0.45 : 1;
        ctx.fillStyle = colour;
        roundRect(brick.x, brick.y, brick.w, brick.h, 5);
        ctx.fill();

        ctx.globalAlpha = armoured && brick.hp === 1 ? 0.3 : 0.28;
        ctx.fillStyle = '#ffffff';
        roundRect(brick.x + 2, brick.y + 2, brick.w - 4, 4, 2);
        ctx.fill();

        if (armoured) {
          ctx.globalAlpha = 1;
          ctx.strokeStyle = palette.fg;
          ctx.lineWidth = 1;
          roundRect(brick.x + 1, brick.y + 1, brick.w - 2, brick.h - 2, 4);
          ctx.stroke();
        }
        ctx.globalAlpha = 1;
      }

      // Power-ups
      for (const power of game.powerUps) {
        ctx.save();
        ctx.translate(power.x, power.y);
        ctx.rotate(Math.sin(power.spin) * 0.22);
        ctx.fillStyle = palette.warning;
        roundRect(-12, -12, 24, 24, 6);
        ctx.fill();
        ctx.fillStyle = palette.bg;
        ctx.font = 'bold 14px ui-monospace, monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(POWER_LABEL[power.kind], 0, 1);
        ctx.restore();
      }

      // Particles
      for (const particle of game.particles) {
        ctx.globalAlpha = Math.max(0, particle.life / particle.maxLife);
        ctx.fillStyle = palette[particle.tone];
        ctx.fillRect(particle.x, particle.y, particle.size, particle.size);
      }
      ctx.globalAlpha = 1;

      // Paddle
      const paddleY = height - PADDLE_BOTTOM - PADDLE_H;
      try {
        // Tokens are OKLCH strings; a browser that cannot parse them would throw
        // on the gradient stop, so fall back to a flat fill rather than dying.
        const gradient = ctx.createLinearGradient(game.paddleX, 0, game.paddleX + game.paddleW, 0);
        gradient.addColorStop(0, palette.brand);
        gradient.addColorStop(1, palette.brandStrong);
        ctx.fillStyle = gradient;
      } catch {
        ctx.fillStyle = palette.brand;
      }
      roundRect(game.paddleX, paddleY, game.paddleW, PADDLE_H, PADDLE_H / 2);
      ctx.fill();

      // Ball trail
      game.trail.forEach((point, index) => {
        const ratio = (index + 1) / game.trail.length;
        ctx.globalAlpha = ratio * 0.22;
        ctx.fillStyle = palette.fg;
        ctx.beginPath();
        ctx.arc(point.x, point.y, 7 * ratio, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;

      // Balls — halo first so the core stays crisp.
      for (const ball of game.balls) {
        ctx.globalAlpha = 0.16;
        ctx.fillStyle = palette.brand;
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.r * 2.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;

        ctx.fillStyle = palette.fg;
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Serve hint
      if (game.phase === 'ready' && game.balls.length === 0) {
        ctx.globalAlpha = 0.35;
        ctx.fillStyle = palette.fgMuted;
        ctx.font = '13px ui-monospace, monospace';
        ctx.textAlign = 'center';
        ctx.fillText('press space to serve', width / 2, height - 22);
        ctx.globalAlpha = 1;
      }

      if (game.flash > 0) {
        ctx.globalAlpha = game.flash * 0.12;
        ctx.fillStyle = palette.fg;
        ctx.fillRect(-40, -40, width + 80, height + 80);
        ctx.globalAlpha = 1;
      }

      ctx.restore();
    };

    /* --------------------------------- loop -------------------------------- */

    const tick = (now: number) => {
      frame = window.requestAnimationFrame(tick);
      const game = gameRef.current;
      if (!game) return;

      const dt = Math.min(0.032, (now - last) / 1000);
      last = now;
      const { w, h } = sizeRef.current;

      if (game.phase !== 'paused') {
        update(game, dt, w, h);
        // Score, combo, and lives all move inside the simulation, so the HUD
        // mirror is refreshed here rather than from React event handlers.
        syncHud();
      }
      draw(game, w, h);
    };

    frame = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      document.removeEventListener('visibilitychange', onVisibility);
      themeObserver.disconnect();
      sizeObserver.disconnect();
    };
  }, [nextLevel, restart, setPhase, syncHud, toggleMute, togglePause]);

  /* ------------------------------- handlers -------------------------------- */

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const game = gameRef.current;
    const container = containerRef.current;
    if (!game || !container) return;
    game.pointerX = event.clientX - container.getBoundingClientRect().left;
  };

  const serve = useCallback(() => {
    const game = gameRef.current;
    if (!game) return;
    blipsRef.current = blipsRef.current ?? new Blips();

    if (game.phase === 'ready') {
      const { w, h } = sizeRef.current;
      game.balls = [serveBall(game, w, h)];
      game.phase = 'playing';
      blipsRef.current.serve();
    } else if (game.phase === 'playing') {
      game.phase = 'paused';
    } else if (game.phase === 'paused') {
      game.phase = 'playing';
    } else if (game.phase === 'level-clear') {
      nextLevel();
    } else {
      restart();
    }
    syncHud();
  }, [nextLevel, restart, syncHud]);

  const overlay = (() => {
    if (hud.phase === 'playing') return null;

    const copy: Record<Exclude<Phase, 'playing'>, { title: string; body: string; action: string }> = {
      ready: {
        title: hud.level === 1 && hud.lives === 3 ? 'Vector Break' : `Life ${4 - hud.lives} of 3`,
        body: 'Move the paddle with the pointer or the arrow keys. Keep the ball alive and clear every brick.',
        action: 'Serve',
      },
      paused: {
        title: 'Paused',
        body: 'The simulation is frozen. Nothing moves until you resume — the ball keeps its momentum.',
        action: 'Resume',
      },
      'level-clear': {
        title: `Level ${hud.level} cleared`,
        body: `Cleared with ${hud.lives} ${hud.lives === 1 ? 'life' : 'lives'} in hand. The next grid is denser and the ball starts faster.`,
        action: `Play level ${hud.level + 1}`,
      },
      'game-over': {
        title: 'Game over',
        body:
          hud.score >= hud.best && hud.score > 0
            ? `New personal best: ${hud.score.toLocaleString()}.`
            : `You scored ${hud.score.toLocaleString()}. Personal best is ${hud.best.toLocaleString()}.`,
        action: 'Play again',
      },
    };

    const screen = copy[hud.phase];

    return (
      <div className="absolute inset-0 flex items-center justify-center bg-bg/70 p-6 backdrop-blur-[2px]">
        <div className="w-full max-w-sm rounded-xl border border-border bg-surface p-6 text-center shadow-xl">
          <p className="text-[11px] font-semibold tracking-[0.18em] text-fg-subtle uppercase">
            Level {hud.level}
          </p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight text-fg">{screen.title}</h2>
          <p className="mt-2 text-sm leading-6 text-fg-muted">{screen.body}</p>
          <div className="mt-5 flex items-center justify-center gap-2">
            <Button onClick={serve}>{screen.action}</Button>
            {hud.phase === 'paused' || hud.phase === 'ready' ? (
              <Button variant="ghost" onClick={restart}>
                Restart
              </Button>
            ) : null}
          </div>
          {hud.phase === 'ready' && hud.best > 0 ? (
            <p className="mt-4 text-xs text-fg-subtle">
              Personal best <span className="font-medium tabular-nums text-fg">{hud.best.toLocaleString()}</span>
            </p>
          ) : null}
        </div>
      </div>
    );
  })();

  return (
    <div className="flex h-full min-h-0 flex-col bg-bg text-fg">
      <header className="flex h-12 shrink-0 items-center gap-3 border-b border-border bg-surface px-4">
        <span
          aria-hidden="true"
          className="flex size-6 items-center justify-center rounded-md bg-brand-600 text-[11px] font-extrabold text-fg-on-brand"
        >
          V
        </span>
        <span className="text-sm font-semibold tracking-tight">Vector Break</span>

        <div className="ml-2 hidden items-center gap-2 sm:flex">
          <Badge tone="brand" size="sm">
            Level {hud.level}
          </Badge>
          {hud.combo >= 3 ? (
            <Badge tone="warning" size="sm" startIcon={<BoltIcon />}>
              ×{hud.combo} combo
            </Badge>
          ) : null}
        </div>

        <div className="ml-auto flex items-center gap-3">
          <span className="text-sm font-semibold tabular-nums text-fg">{hud.score.toLocaleString()}</span>
          <span className="hidden items-center gap-1.5 text-xs text-fg-subtle sm:flex">
            <StarIcon className="size-3.5" />
            <span className="tabular-nums">{hud.best.toLocaleString()}</span>
          </span>
          <span className="flex items-center gap-1" aria-label={`${hud.lives} lives remaining`}>
            {[0, 1, 2].map((index) => (
              <HeartIcon
                key={index}
                className={cn('size-4', index < hud.lives ? 'text-danger-fg' : 'text-border-strong')}
              />
            ))}
          </span>
          <Button size="sm" variant="secondary" onClick={togglePause}>
            {hud.phase === 'playing' ? 'Pause' : 'Resume'}
          </Button>
          <Button size="sm" variant="ghost" onClick={restart}>
            Restart
          </Button>
        </div>
      </header>

      <div className="grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)_256px] divide-x divide-border overflow-hidden">
        <div
          ref={containerRef}
          onPointerMove={handlePointerMove}
          className="relative min-h-0 touch-none select-none overflow-hidden"
        >
          <canvas ref={canvasRef} className="absolute inset-0 size-full" />
          {overlay}
        </div>

        <aside className="flex min-h-0 flex-col gap-5 overflow-y-auto bg-surface p-4">
          <section className="flex flex-col gap-2">
            <h2 className="flex items-center gap-1.5 text-[11px] font-semibold tracking-wide text-fg-subtle uppercase">
              <KeyboardIcon className="size-3.5" />
              Controls
            </h2>
            <dl className="flex flex-col gap-2 text-xs">
              {CONTROLS.map((control) => (
                <div key={control.action + control.keys.join('')} className="flex items-center justify-between gap-3">
                  <dt className="flex items-center gap-1">
                    {control.keys.map((key) => (
                      <Kbd key={key}>{key}</Kbd>
                    ))}
                  </dt>
                  <dd className="text-right text-fg-muted">{control.action}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="flex flex-col gap-2 border-t border-border pt-4">
            <h2 className="text-[11px] font-semibold tracking-wide text-fg-subtle uppercase">Session</h2>
            <div className="flex flex-col gap-1.5">
              <div className="flex items-baseline justify-between gap-3 text-xs">
                <span className="text-fg-muted">Grid cleared</span>
                <span className="font-medium tabular-nums text-fg">
                  {hud.total - hud.remaining}/{hud.total}
                </span>
              </div>
              <Progress
                value={hud.total - hud.remaining}
                max={hud.total || 1}
                tone="brand"
                size="sm"
                label="Grid cleared"
              />
            </div>
            <dl className="flex flex-col gap-1.5 text-xs">
              {[
                ['Bricks broken', hud.bricksBroken.toLocaleString()],
                ['Best combo', `×${hud.bestCombo}`],
                ['Power-ups', String(hud.powerUpsCollected)],
                ['Level reached', String(hud.level)],
              ].map(([label, value]) => (
                <div key={label} className="flex items-baseline justify-between gap-3">
                  <dt className="text-fg-muted">{label}</dt>
                  <dd className="font-medium tabular-nums text-fg">{value}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="flex flex-col gap-2 border-t border-border pt-4">
            <h2 className="text-[11px] font-semibold tracking-wide text-fg-subtle uppercase">Power-ups</h2>
            <ul className="flex flex-col gap-2 text-xs">
              {(
                [
                  ['wide', 'W'],
                  ['multi', 'M'],
                  ['slow', 'S'],
                ] as const
              ).map(([kind, letter]) => (
                <li key={kind} className="flex items-center gap-2.5">
                  <span
                    aria-hidden="true"
                    className="flex size-6 shrink-0 items-center justify-center rounded-md bg-warning-subtle text-[11px] font-bold text-warning-fg"
                  >
                    {letter}
                  </span>
                  <span className="text-fg-muted">{POWER_NAME[kind]}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="flex flex-col gap-2 border-t border-border pt-4">
            <h2 className="text-[11px] font-semibold tracking-wide text-fg-subtle uppercase">Brick values</h2>
            <ul className="flex flex-col gap-2 text-xs">
              <li className="flex items-center gap-2.5">
                <span aria-hidden="true" className="h-3 w-6 shrink-0 rounded-sm bg-danger" />
                <span className="text-fg-muted">Armoured — two hits</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span aria-hidden="true" className="h-3 w-6 shrink-0 rounded-sm bg-info" />
                <span className="text-fg-muted">Standard — one hit</span>
              </li>
              <li className="flex items-center gap-2.5">
                <GaugeIcon className="size-3.5 shrink-0 text-fg-subtle" />
                <span className="text-fg-muted">Deeper rows score the same; combo is what pays</span>
              </li>
            </ul>
          </section>

          <section className="mt-auto flex items-center justify-between gap-3 border-t border-border pt-4">
            <span className="text-xs text-fg-muted">Sound effects</span>
            <Switch
              checked={!muted}
              onCheckedChange={(checked) => setMute(!checked)}
              size="sm"
              label="Sound effects"
            />
          </section>
        </aside>
      </div>
    </div>
  );
}
