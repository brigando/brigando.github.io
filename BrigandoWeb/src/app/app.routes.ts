import { Routes } from '@angular/router';
import { CaseStudy } from './case-study/case-study';
import { Home } from './home/home';

export const routes: Routes = [
  { path: '', component: Home, title: 'Brigando' },
  { path: 'work/:slug', component: CaseStudy, title: 'Brigando · Case study' },
  { path: '**', redirectTo: '' },
];
