import cors from 'cors';
import express from 'express';

import incidentsRouter from './routes/incidents.route';
import usersRouter from './routes/users.route';

export function createApp() {
  // Crea la aplicación de Express
  const app = express();

  // Configura CORS para permitir solicitudes desde el frontend
  app.use(
    cors({
      origin: ['http://localhost:4200', 'http://localhost:4300'],
    })
  );
  // Configura el middleware para parsear el cuerpo de las solicitudes como JSON
  app.use(express.json());

  // Agrega la ruta para la salud de la aplicación
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    });
  });

  // Monta las rutas para los incidentes y los usuarios
  app.use('/api/incidents', incidentsRouter);
  app.use('/api/users', usersRouter);

  return app;
}

export type AppInstance = ReturnType<typeof createApp>;
