// src/app/app.routes.ts

import { Routes } from '@angular/router';
import { Form } from './form/form';
import { CoursesDetails } from './courses/components/courses-details/courses-details';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/manager-zadan',
    pathMatch: 'full',
  },
  {
    path: 'form',
    component: Form,
  },
  {
    path: 'learn',
    loadComponent: () => {
      return import('./learn/learn').then((m) => m.Learn);
    },
  },
  {
    path: 'hangman-game/game-over',
    loadComponent: () => {
      return import('./game-over/game-over').then((m) => m.GameOver);
    },
  },
  {
    path: 'hangman-game',
    loadComponent: () => {
      return import('./hangman/hangman').then((m) => m.Hangman);
    },
  },
  {
    path: 'manager-zadan',
    loadComponent: () => {
      return import('./home/home').then((m) => m.Home);
    },
  },
  {
    path: 'courses',
    loadComponent: () => {
      return import('./courses/courses').then((m) => m.Courses);
    },
  },
  // {
  //   path: 'courses/:id',
  //   loadComponent: () => {
  //     return import(
  //       './courses/components/courses-details/courses-details'
  //     ).then((m) => m.CoursesDetails); // Powinno być: m.CoursesDetails
  //   },
  // },
  {
    path: 'courses/:id',
    component: CoursesDetails, // Dla standalone components nie trzeba lazy loadować
  },
];
