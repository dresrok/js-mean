import mongoose from 'mongoose';

export async function connectToDatabase() {
  const mongoUrl = process.env.MONGO_URL!;

  // Listeners básicos para tener visibilidad del estado de la conexión.
  mongoose.connection.on('connected', () => console.log('[mongo] Conectado a la base de datos'));
  mongoose.connection.on('error', (err) => console.error('[mongo] Error', err));
  mongoose.connection.on('disconnected', () => console.warn('[mongo] Base de datos desconectada'));

  // Si ya existe una conexión activa reutilizamos el pool existente.
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection.asPromise();
  }

  // Abre una nueva conexión reutilizando índices y controlando el tamaño del pool.
  return mongoose.connect(mongoUrl, {
    autoIndex: true,
    maxPoolSize: 10,
  });
}
