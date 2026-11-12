import { Component, DestroyRef, ElementRef, OnInit, inject, output, signal, viewChild } from '@angular/core';
import { PROJECTS } from '../projects';

/** Keep the loader up at least this long so the animation can play out. */
const MIN_LOADING_MS = 2200;
/** Matches the fade-out duration in intro.scss. */
const EXIT_MS = 700;

const BOOT_LOG = [
  'init kernel.brigando',
  'mount /studios/nth',
  'mount /cycles/soarer',
  'mount /tech/brigando',
  'mount /robotics/brn',
  'handshake ... ok',
];

@Component({
  selector: 'app-intro',
  templateUrl: './intro.html',
  styleUrl: './intro.scss',
})
export class Intro implements OnInit {
  readonly entered = output<void>();

  protected readonly letters = 'Brigando'.split('');
  protected readonly state = signal<'loading' | 'ready' | 'leaving'>('loading');
  protected readonly percent = signal(0);
  protected readonly log = signal<string[]>([]);

  private readonly enterButton = viewChild<ElementRef<HTMLButtonElement>>('enterButton');
  private readonly destroyRef = inject(DestroyRef);

  async ngOnInit(): Promise<void> {
    const started = performance.now();
    const ticker = setInterval(() => {
      // Progress tracks elapsed time, capped at 99% until assets are actually ready.
      const t = Math.min((performance.now() - started) / MIN_LOADING_MS, 1);
      this.percent.set(Math.min(99, Math.round(t * 100)));
      this.log.set(BOOT_LOG.slice(0, Math.ceil(t * BOOT_LOG.length)));
    }, 40);
    this.destroyRef.onDestroy(() => clearInterval(ticker));

    await Promise.all([
      wait(MIN_LOADING_MS),
      document.fonts?.ready,
      ...PROJECTS.map((p) => preload(p.logo)),
    ]);

    clearInterval(ticker);
    this.percent.set(100);
    this.log.set([...BOOT_LOG, 'system ready']);
    this.state.set('ready');
    // Focus the button once it renders so keyboard users can just press Enter.
    setTimeout(() => this.enterButton()?.nativeElement.focus());
  }

  protected enter(): void {
    if (this.state() !== 'ready') return;
    this.state.set('leaving');
    setTimeout(() => this.entered.emit(), EXIT_MS);
  }
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Resolves when the image has loaded (or failed — never block the intro on it). */
function preload(src: string): Promise<void> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = img.onerror = () => resolve();
    img.src = src;
  });
}
