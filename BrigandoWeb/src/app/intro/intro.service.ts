import { Injectable, signal } from '@angular/core';

/** Whether the welcome screen is covering the page. */
@Injectable({ providedIn: 'root' })
export class IntroService {
  /** Shown when landing on the home page, not on a direct case-study link. */
  readonly visible = signal(location.pathname === '/');
}
