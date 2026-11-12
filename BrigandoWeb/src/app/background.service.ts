import { Injectable, signal } from '@angular/core';

/** Which project is hovered or open; the code rain takes its colour. */
@Injectable({ providedIn: 'root' })
export class BackgroundService {
  readonly active = signal<string | null>(null);
}
