import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthService } from './auth.service';
import { NotificationsService } from './notifications.service';

/**
 * Interceptor que:
 * 1. Adjunta el token de autorización a cada request
 * 2. Maneja errores 401 (Unauthorized) forzando logout
 * 3. Maneja errores 403 (Forbidden) mostrando mensaje al usuario
 */
export const authInterceptor: HttpInterceptorFn = (initialRequest, next) => {
  const auth = inject(AuthService);
  const notifications = inject(NotificationsService);

  const token = auth.getAccessToken();
  const request = token
    ? initialRequest.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : initialRequest;

  return next(request).pipe(
    catchError((error) => {
      if (error instanceof HttpErrorResponse) {
        if (error.status === 401) {
          // Si el backend rechaza la petición, reiniciamos la sesión para evitar bucles de error.
          auth.handleUnauthorized();
        } else if (error.status === 403) {
          // El usuario no tiene permisos para realizar esta acción.
          // Mostramos un mensaje claro sin forzar logout.
          const message =
            error.error?.message || 'No tienes permisos para realizar esta acción';
          notifications.error(message);
        }
      }

      return throwError(() => error);
    })
  );
};
