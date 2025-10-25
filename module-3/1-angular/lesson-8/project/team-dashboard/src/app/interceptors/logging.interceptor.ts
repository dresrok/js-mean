import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { LoggerService } from '../services/logger.service';

/**
 * Interceptor de logging para HTTP
 *
 * Funcionalidad:
 * - Registra todas las peticiones HTTP (método + URL)
 * - Registra las respuestas exitosas (status + tiempo de respuesta)
 * - Registra los errores HTTP con detalles
 * - Útil para debugging y monitoreo de la aplicación
 *
 * Ventajas educativas:
 * - Demuestra el patrón de interceptores funcionales en Angular
 * - Muestra cómo medir el tiempo de las peticiones
 * - Ilustra el manejo centralizado de logs HTTP
 */
export const loggingInterceptor: HttpInterceptorFn = (req, next) => {
  const logger = inject(LoggerService);
  const startTime = Date.now();

  // Log de la petición saliente
  logger.log(`Petición HTTP iniciada ${req.method} ${req.url}`);

  return next(req).pipe(
    tap(event => {
      // Verificar si es una respuesta HTTP completa usando instanceof
      if (event instanceof HttpResponse) {
        const elapsedTime = Date.now() - startTime;

        // Log de respuesta exitosa con tipos adecuados
        logger.log(
          `Petición HTTP finalizada ${req.method} ${req.url}`,
          {
            status: event.status,
            statusText: event.statusText,
            time: `${elapsedTime}ms`
          }
        );
      }
    }),
    catchError(error => {
      // Calcular tiempo hasta el error
      const elapsedTime = Date.now() - startTime;

      // Log de error HTTP
      logger.log(
        `HTTP ✗ ${req.method} ${req.url}`,
        {
          status: error.status,
          statusText: error.statusText,
          message: error.message,
          time: `${elapsedTime}ms`
        }
      );

      // Re-throw el error para que lo manejen los componentes
      return throwError(() => error);
    })
  );
};
