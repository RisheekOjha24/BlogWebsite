import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
//fot Lottie Animation
import { provideLottieOptions } from 'ngx-lottie';
import { authInterceptor } from './interceptors/auth.interceptor';

import { provideToastr } from 'ngx-toastr';

export const appConfig: ApplicationConfig = {
  providers: [
    SweetAlert2Module,
    provideHttpClient(withInterceptors([authInterceptor])),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideLottieOptions({
      player: () => import('lottie-web'),
    }),
    provideAnimationsAsync(),
    provideToastr({
      positionClass: 'toast-top-center', // Customize position
      timeOut: 4000, // Customize timeout
      newestOnTop: false, // Show new toasts below older ones
      preventDuplicates: true, // Prevent duplicate toasts
    }),
  ],
};
