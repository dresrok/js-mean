import dotenv from 'dotenv';

import { createApp } from './app';

// Carga las variables de entorno
dotenv.config();

// Crea la aplicación
const app = createApp();
// Obtiene el puerto desde las variables de entorno, si no se proporciona, usa 8080
const port = process.env.PORT ?? '8080';

// Inicia el servidor
app.listen(Number(port), () => {
  console.log(`Tablero de Incidentes API funcionando en http://localhost:${port}`);
});
