import { Component, OnDestroy, computed, effect, inject, input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { BackgroundService } from '../background.service';
import { findProject } from '../projects';

@Component({
  selector: 'app-case-study',
  imports: [RouterLink],
  templateUrl: './case-study.html',
  styleUrl: './case-study.scss',
})
export class CaseStudy implements OnDestroy {
  /** Bound from the `:slug` route param. */
  readonly slug = input.required<string>();
  protected readonly project = computed(() => findProject(this.slug()));

  private readonly background = inject(BackgroundService);
  private readonly router = inject(Router);

  constructor() {
    effect(() => {
      const project = this.project();
      if (project) {
        this.background.active.set(project.slug);
      } else {
        this.router.navigate(['/']);
      }
    });
  }

  ngOnDestroy(): void {
    this.background.active.set(null);
  }
}
