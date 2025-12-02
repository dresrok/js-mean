import type { ErrorRequestHandler } from 'express';
import mongoose from 'mongoose';

// Middleware centralizado para traducir errores comunes de Mongoose/Express.
export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  // Enviamos errores de validación con detalle para ayudar a la UI a mostrar feedback.
  if (err instanceof mongoose.Error.ValidationError) {
    return res.status(422).json({
      message: 'Validation failed',
      details: err.errors,
    });
  }

  // CastError indica IDs inválidos o mal formateados enviados por el cliente.
  if (err instanceof mongoose.Error.CastError) {
    return res.status(400).json({ message: 'Invalid identifier' });
  }

  // Para cualquier otro error preferimos guardar un log y responder genérico.
  console.error('[api] unhandled error', err);
  return res.status(500).json({ message: 'Unexpected server error' });
};
