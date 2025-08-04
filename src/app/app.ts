import { Component, importProvidersFrom } from '@angular/core';
import { provideRouter, RouterOutlet } from '@angular/router';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { NgxsModule } from '@ngxs/store';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { routes } from './app.routes';
import { Header } from './components/header/header';
import { Footer } from './components/footer/footer';
import { CoursesState } from './courses/store/courses.state';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Header, Footer],
  template: `
    <app-header />
    <router-outlet></router-outlet>
    <app-footer />
  `,
  styles: [],
})
export class App {
  title = 'manager-zadan';
}

bootstrapApplication(App, {
  providers: [
    // Router
    provideRouter(routes),

    // HTTP Client
    provideHttpClient(),

    // Animations
    provideAnimations(),

    // Toastr
    provideToastr({
      timeOut: 3000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
    }),

    // NGXS
    importProvidersFrom(
      NgxsModule.forRoot([CoursesState]),
      NgxsReduxDevtoolsPluginModule.forRoot({
        name: 'NGXS Store',
        disabled: false, // Ustaw na true w produkcji
        maxAge: 25, // Liczba akcji do zachowania w historii
      })
    ),
  ],
}).catch((err) => console.error(err));
