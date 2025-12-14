import cors, { type CorsOptions } from 'cors';
import express from 'express';
import helmet from 'helmet';
import pinoHttp from 'pino-http';

import { requireAuth } from './core/auth.middleware';
import { errorHandler } from './core/error-handler.middleware';
import { authRouter } from './domains/auth/auth.routes';
import { incidentsRouter } from './domains/incidents/incidents.routes';
import { usersRouter } from './domains/users/users.routes';

const DEFAULT_ALLOWED_ORIGINS = ['http://localhost:4200', 'http://localhost:4300'];

// Factory que crea y configura la aplicación Express con todos sus middlewares y rutas.
export function createApp() {
  // Crea la aplicación de Express que servirá como backend principal.
  const app = express();

  // Middleware de logging estructurado con pino-http para facilitar la trazabilidad y auditoría
  app.use(
    pinoHttp({
      quietReqLogger: true,
      customSuccessMessage(_req, res) {
        return `${res.statusCode} completed`;
      },
      customErrorMessage(_req, _res, error) {
        return `Request failed: ${error.message}`;
      },
      customAttributeKeys: {
        req: 'request',
        res: 'response',
        err: 'error',
      },
      serializers: {
        req(request) {
          return {
            method: request.method,
            url: request.url,
          };
        },
        res(response) {
          return {
            statusCode: response.statusCode,
          };
        },
      },
    })
  );

  // Middleware de seguridad con helmet para proteger contra ataques comunes
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'same-site' },
    })
  );

  // Orígenes permitidos
  const allowedOrigins = (process.env.CORS_ORIGINS ?? DEFAULT_ALLOWED_ORIGINS.join(','))
    .split(',')
    .map((origin) => origin.trim())
    .filter((origin) => origin.length > 0);

  // Options de CORS
  const corsOptions: CorsOptions = {
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  };

  // Middleware de CORS
  app.use(cors(corsOptions));
  // Habilita el parseo de JSON en los cuerpos de las peticiones entrantes.
  app.use(express.json({ limit: '1mb' }));

  // Endpoint de salud para monitoreo rápido del servicio.
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    });
  });

  // Agrupa las rutas de dominio bajo el prefijo /api.
  app.use('/api/auth', authRouter);
  // Protegemos recursos sensibles con el middleware que valida el JWT.
  app.use('/api/incidents', requireAuth, incidentsRouter);
  app.use('/api/users', requireAuth, usersRouter);
  // Middleware global de manejo de errores expresivos.
  app.use(errorHandler);

  return app;
}

// Tipo auxiliar que extrae el tipo de retorno de createApp.
export type AppInstance = ReturnType<typeof createApp>;
