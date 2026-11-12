import { Component, DestroyRef, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs';

/** Decorative heads-up display framing the viewport. */
@Component({
  selector: 'app-hud',
  templateUrl: './hud.html',
  styleUrl: './hud.scss',
  host: { 'aria-hidden': 'true' },
})
export class Hud {
  protected readonly time = signal(clock());
  protected readonly x = signal(0);
  protected readonly y = signal(0);
  protected readonly route = toSignal(
    inject(Router).events.pipe(
      filter((e) => e instanceof NavigationEnd),
      map((e) => (e as NavigationEnd).urlAfterRedirects),
    ),
    { initialValue: location.pathname },
  );

  constructor() {
    const timer = setInterval(() => this.time.set(clock()), 1000);
    const onMove = (e: MouseEvent) => {
      this.x.set(e.clientX);
      this.y.set(e.clientY);
    };
    window.addEventListener('mousemove', onMove, { passive: true });

    inject(DestroyRef).onDestroy(() => {
      clearInterval(timer);
      window.removeEventListener('mousemove', onMove);
    });
  }

  protected pad(n: number): string {
    return String(n).padStart(4, '0');
  }
}

function clock(): string {
  return new Date().toISOString().slice(11, 19) + 'Z';
}
