import type { NextFunction, Request, Response } from 'express';

import { verifyAccessToken } from '../domains/auth/auth.service';
import type { AuthTokenPayload } from '../domains/auth/auth.types';
import { InvalidTokenError } from '../domains/auth/auth.exceptions';
import { hasAllPermissions, type Permission } from './permissions';

// Extendemos el tipo Request de Express para incluir el payload del usuario autenticado.
declare global {
  namespace Express {
    interface Request {
      user?: AuthTokenPayload;
    }
  }
}

// Middleware que valida la presencia y validez del JWT en solicitudes protegidas.
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  // Extraemos el token del encabezado estándar Authorization: Bearer <token>.
  const header = req.headers.authorization ?? '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    // Verificamos la firma del token y adjuntamos el payload al request.
    const payload = verifyAccessToken(token);
    req.user = payload;
    return next();
  } catch (error) {
    if (error instanceof InvalidTokenError) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    return next(error);
  }
}

// Middleware de autorización que verifica si el usuario tiene los permisos requeridos.
export function authorize(...requiredPermissions: Permission[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    // Verificamos que el usuario esté autenticado.
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Verificamos que el usuario tenga todos los permisos requeridos.
    if (!hasAllPermissions(req.user.role, requiredPermissions)) {
      return res.status(403).json({
        message: 'Forbidden',
        code: 'FORBIDDEN',
        required: requiredPermissions,
      });
    }

    return next();
  };
}
