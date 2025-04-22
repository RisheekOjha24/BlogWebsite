import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
//fot Lottie Animation
import { provideLottieOptions } from 'ngx-lottie';



export const appConfig: ApplicationConfig = {
  providers: [
    SweetAlert2Module,
    provideHttpClient(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideLottieOptions({
      player: () => import('lottie-web'),
    }),
  ],
};
