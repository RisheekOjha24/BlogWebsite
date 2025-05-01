import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const toastr = inject(ToastrService);

  const cloned = req.clone({
    withCredentials: true,
  });
  return next(cloned).pipe(
    catchError((error) => {
      if (error.status === 401) {
        toastr.error('Please Login to Continue', 'Unauthorized');
        router.navigate(['/login']);
      } else if (error.status === 403) {
        toastr.error(
          error?.error.message || 'Please Login to Continue',
          'Session expired'
        );
        localStorage.clear();
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};
