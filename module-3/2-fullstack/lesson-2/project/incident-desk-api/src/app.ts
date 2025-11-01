import cors from 'cors';
import express from 'express';

import { errorHandler } from './core/error-handler.middleware';
import { incidentsRouter } from './domains/incidents/incidents.routes';
import { usersRouter } from './domains/users/users.routes';

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
  app.use('/api/incidents', incidentsRouter);
  app.use('/api/users', usersRouter);
  // Middleware global de manejo de errores expresivos.
  app.use(errorHandler);

  return app;
}

export type AppInstance = ReturnType<typeof createApp>;
