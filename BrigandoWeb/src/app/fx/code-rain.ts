import {
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  computed,
  inject,
  viewChild,
} from '@angular/core';
import { BackgroundService } from '../background.service';
import { findProject } from '../projects';

const GLYPHS = '0123456789ABCDEF<>/{}[]=+*#$:;'.split('');
const FONT_SIZE = 14;
const FPS = 18;
const BASE_COLOR = '--card-bg-color';
/** Fraction of the way to the target colour covered each frame (~1.2s to settle). */
const COLOR_EASE = 0.12;

type Rgb = [number, number, number];

/**
 * Falling-characters background, drawn on a canvas behind the page.
 * Fades to the hovered/open project's colour.
 */
@Component({
  selector: 'app-code-rain',
  template: '<canvas #canvas aria-hidden="true"></canvas>',
  host: { '[class.active]': 'active()' },
  styles: `
    :host {
      position: fixed;
      inset: 0;
      z-index: -1;
      pointer-events: none;
    }
    canvas {
      width: 100%;
      height: 100%;
      opacity: 0.22;
      mask-image: linear-gradient(to bottom, transparent, #000 25%, #000 70%, transparent);
      transition: opacity 0.5s ease-in-out;
    }
    :host(.active) canvas {
      opacity: 0.8;
    }
  `,
})
export class CodeRain {
  private readonly canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');
  private readonly background = inject(BackgroundService);

  protected readonly active = computed(() => this.background.active() !== null);

  /** CSS variable holding the colour the rain should be heading towards. */
  private readonly targetVar = computed(() => {
    const accent = findProject(this.background.active())?.accent;
    return accent?.match(/var\((--[\w-]+)\)/)?.[1] ?? BASE_COLOR;
  });

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const stop = this.start(this.canvas().nativeElement);
      destroyRef.onDestroy(stop);
    });
  }

  private start(canvas: HTMLCanvasElement): () => void {
    const ctx = canvas.getContext('2d');
    if (!ctx) return () => {};

    const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let drops: number[] = [];
    let speeds: number[] = [];
    let color = readColor(BASE_COLOR);

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const columns = Math.ceil(canvas.clientWidth / FONT_SIZE);
      drops = Array.from({ length: columns }, () => Math.random() * -60);
      speeds = Array.from({ length: columns }, () => 0.4 + Math.random() * 0.8);
    };

    const draw = (ease: number) => {
      const target = readColor(this.targetVar());
      color = color.map((c, i) => c + (target[i] - c) * ease) as Rgb;
      const fill = `rgb(${color.map(Math.round).join(',')})`;

      // Fade the previous frame to leave trails.
      ctx.fillStyle = 'rgba(0, 0, 0, 0.12)';
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
      ctx.globalCompositeOperation = 'source-over';

      ctx.font = `${FONT_SIZE}px ui-monospace, Consolas, monospace`;
      for (let i = 0; i < drops.length; i++) {
        const y = drops[i] * FONT_SIZE;
        if (y > 0) {
          const glyph = GLYPHS[(Math.random() * GLYPHS.length) | 0];
          ctx.fillStyle = Math.random() > 0.97 ? '#ffffff' : fill;
          ctx.fillText(glyph, i * FONT_SIZE, y);
        }
        drops[i] += speeds[i];
        if (y > canvas.clientHeight && Math.random() > 0.975) {
          drops[i] = Math.random() * -20;
        }
      }
    };

    resize();
    window.addEventListener('resize', resize);

    let raf = 0;
    let last = 0;
    let lastVar = '';
    const loop = (t: number) => {
      raf = requestAnimationFrame(loop);
      if (t - last < 1000 / FPS) return;
      last = t;
      if (!reduceMotion) {
        draw(COLOR_EASE);
      } else if (this.targetVar() !== lastVar) {
        // Reduced motion: repaint one still frame whenever the colour changes.
        lastVar = this.targetVar();
        ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
        for (let i = 0; i < 80; i++) draw(1);
      }
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }
}

const colorCache = new Map<string, Rgb>();

/** Reads a hex colour from a CSS variable on :root. */
function readColor(cssVar: string): Rgb {
  let rgb = colorCache.get(cssVar);
  if (!rgb) {
    const hex = getComputedStyle(document.documentElement).getPropertyValue(cssVar).trim();
    const n = parseInt(hex.replace('#', ''), 16);
    rgb = Number.isNaN(n) ? [139, 137, 166] : [(n >> 16) & 255, (n >> 8) & 255, n & 255];
    colorCache.set(cssVar, rgb);
  }
  return rgb;
}
