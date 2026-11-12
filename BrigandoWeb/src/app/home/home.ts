import { Component, DestroyRef, OnInit, effect, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BackgroundService } from '../background.service';
import { IntroService } from '../intro/intro.service';
import { PROJECTS } from '../projects';

/** Max tilt in degrees at the card's edges. */
const MAX_TILT = 14;
const TYPE_MS = 55;

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  protected readonly projects = PROJECTS;
  protected readonly subtitle = 'Welcome to my world.';
  protected readonly typed = signal('');

  private readonly background = inject(BackgroundService);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    // Start typing once the welcome screen is out of the way.
    const intro = inject(IntroService);
    const ref = effect(() => {
      if (!intro.visible()) {
        this.typeSubtitle();
        ref.destroy();
      }
    });
  }

  ngOnInit(): void {
    this.background.active.set(null);
  }

  protected enter(slug: string): void {
    this.background.active.set(slug);
  }

  protected leave(card: HTMLElement): void {
    this.background.active.set(null);
    card.style.setProperty('--rx', '0deg');
    card.style.setProperty('--ry', '0deg');
  }

  protected tilt(event: MouseEvent, card: HTMLElement): void {
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width; // 0..1
    const y = (event.clientY - rect.top) / rect.height; // 0..1
    card.style.setProperty('--ry', `${(x - 0.5) * 2 * MAX_TILT}deg`);
    card.style.setProperty('--rx', `${(0.5 - y) * 2 * MAX_TILT}deg`);
    card.style.setProperty('--glare-x', `${x * 100}%`);
    card.style.setProperty('--glare-y', `${y * 100}%`);
  }

  /** Types the subtitle out one character at a time. */
  private typeSubtitle(): void {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.typed.set(this.subtitle);
      return;
    }
    let i = 0;
    const timer = setInterval(() => {
      this.typed.set(this.subtitle.slice(0, ++i));
      if (i >= this.subtitle.length) clearInterval(timer);
    }, TYPE_MS);
    this.destroyRef.onDestroy(() => clearInterval(timer));
  }
}
