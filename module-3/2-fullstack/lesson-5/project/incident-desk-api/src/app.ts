import cors from 'cors';
import express from 'express';

import { requireAuth } from './core/auth.middleware';
import { errorHandler } from './core/error-handler.middleware';
import { authRouter } from './domains/auth/auth.routes';
import { incidentsRouter } from './domains/incidents/incidents.routes';
import { usersRouter } from './domains/users/users.routes';

// Factory que crea y configura la aplicación Express con todos sus middlewares y rutas.
export function createApp() {
  // Crea la aplicación de Express que servirá como backend principal.
  const app = express();

  // Configura CORS para permitir solicitudes desde los frontends previstos.
  app.use(
    cors({
      origin: ['http://localhost:4200', 'http://localhost:4300'],
    })
  );
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
