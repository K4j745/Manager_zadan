import {
  ApplicationConfig,
  importProvidersFrom,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';

// NGXS imports
import { NgxsModule, provideStore } from '@ngxs/store';
import {
  NgxsReduxDevtoolsPluginModule,
  withNgxsReduxDevtoolsPlugin,
} from '@ngxs/devtools-plugin';

import { FlashcardsState } from '../state/flashcard.state'; // Twoja ścieżka
import { environment } from '../environments/enviroment';
import { CoursesState } from './courses/store/courses.state';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),

    // Konfiguracja NGXS
    provideStore(
      [FlashcardsState],
      withNgxsReduxDevtoolsPlugin({
        disabled: environment.production,
      })
    ),
    importProvidersFrom(
      NgxsModule.forRoot([CoursesState], {
        developmentMode: true,
      }),
      NgxsLoggerPluginModule.forRoot({
        disabled: false,
      }),
      NgxsReduxDevtoolsPluginModule.forRoot({
        disabled: false,
      })
    ),
  ],
};
