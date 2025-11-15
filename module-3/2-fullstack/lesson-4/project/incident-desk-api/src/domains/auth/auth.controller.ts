import type { NextFunction, Request, Response } from 'express';

import { InvalidCredentialsError } from './auth.exceptions';
import { authenticateUser } from './auth.service';
import type { LoginPayload } from './auth.types';


// Maneja POST /api/auth/login autenticando al usuario con credenciales básicas.
export async function login(req: Request<unknown, unknown, LoginPayload>, res: Response, next: NextFunction) {
  const { email, password } = req.body ?? {};

  // Validación mínima antes de delegar en la capa de dominio.
  if (!email || !password) {
    return res.status(400).json({ message: 'Email y password son obligatorios' });
  }

  try {
    // Delegamos la lógica al servicio para mantener el controlador delgado.
    const authResponse = await authenticateUser(email, password);
    return res.json(authResponse);
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    return next(error);
  }
}
