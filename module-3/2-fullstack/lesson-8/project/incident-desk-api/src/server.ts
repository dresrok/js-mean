import dotenv from 'dotenv';

import { createApp } from './app';
import { connectToDatabase } from './core/database';
import { seedReferenceFromDatabase } from './domains/incidents/incidents.service';

// Carga las variables de entorno definidas en .env antes de inicializar servicios.
dotenv.config();

// Función principal que arranca el servidor tras conectarse a MongoDB.
async function bootstrap() {
  // Establece la conexión con MongoDB antes de levantar Express.
  await connectToDatabase();
  // Sincroniza la secuencia de referencias según el último incidente guardado.
  await seedReferenceFromDatabase();

  const app = createApp();
  const port = process.env.PORT ?? '8080';

  app.listen(Number(port), () => {
    console.log(`[app] Tablero de Incidentes API funcionando en http://localhost:${port}`);
  });
}

bootstrap().catch((error) => {
  console.error('[app] Failed to bootstrap application', error);
  process.exit(1);
});
