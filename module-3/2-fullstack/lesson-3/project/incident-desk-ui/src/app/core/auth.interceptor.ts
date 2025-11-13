import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthService } from './auth.service';

// Interceptor que adjunta el token a cada request y fuerza logout ante respuestas 401.
export const authInterceptor: HttpInterceptorFn = (initialRequest, next) => {
  const auth = inject(AuthService);

  const token = auth.getAccessToken();
  const request = token
    ? initialRequest.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : initialRequest;

  return next(request).pipe(
    catchError((error) => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        // Si el backend rechaza la petición, reiniciamos la sesión para evitar bucles de error.
        auth.handleUnauthorized();
      }

      return throwError(() => error);
    })
  );
};
