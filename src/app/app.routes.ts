// src/app/app.routes.ts

import { Routes } from '@angular/router';
import { Form } from './form/form';

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
    path: 'game-over',
    loadComponent: () => {
      return import('./hangman-game/components/game-over/game-over').then(
        (m) => m.GameOver
      );
    },
  },
  {
    path: 'hangman-game',
    loadComponent: () => {
      return import('./hangman-game/hangman-game').then((m) => m.HangmanGame);
    },
  },
  {
    path: 'manager-zadan',
    loadComponent: () => {
      return import('./home/home').then((m) => m.Home);
    },
  },
];
