import type { NextFunction, Request, Response } from 'express';

import { verifyAccessToken } from '../domains/auth/auth.service';
import type { AuthTokenPayload } from '../domains/auth/auth.types';
import { InvalidTokenError } from '../domains/auth/auth.exceptions';

// Middleware que valida la presencia y validez del JWT en solicitudes protegidas.
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  // Extraemos el token del encabezado estándar Authorization: Bearer <token>.
  const header = req.headers.authorization ?? '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    // Verificamos la firma del token antes de continuar con el pipeline de Express.
    verifyAccessToken(token);
    return next();
  } catch (error) {
    if (error instanceof InvalidTokenError) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    return next(error);
  }
}
