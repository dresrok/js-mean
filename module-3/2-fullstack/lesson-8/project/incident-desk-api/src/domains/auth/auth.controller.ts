import type { NextFunction, Request, Response } from 'express'
import { treeifyError, z, ZodSafeParseResult } from 'zod';

import { InvalidCredentialsError } from './auth.exceptions';
import { authenticateUser, registerUser } from './auth.service';
import type { LoginPayload } from './auth.types';

type RegisterPayloadSchema = z.infer<typeof registerPayloadSchema>;
const registerPayloadSchema = z
  .object({
    fullName: z.string().trim().min(3).max(120),
    email: z.string().trim().email().transform((val) => val.toLowerCase()),
    // bcrypt sólo usa los primeros 72 chars; limitamos para evitar confusión/bugs.
    password: z.string().min(6).max(72),
  })
  .strict();

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

// Maneja POST /api/auth/register registrando un usuario público (rol: reporter) y devolviendo token + usuario.
export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const parsedPayload: ZodSafeParseResult<RegisterPayloadSchema> = registerPayloadSchema.safeParse(req.body);

    if (!parsedPayload.success) {
      return res.status(400).json({
        code: 'VALIDATION_FAILED',
        message: 'Bad Request',
        errors: treeifyError(parsedPayload.error),
      });
    }

    const authResponse = await registerUser(parsedPayload.data);
    return res.status(201).json(authResponse);
  } catch (error: any) {
    // Error de índice único (email duplicado) en Mongo/Mongoose.
    if (error?.code === 11000) {
      return res.status(409).json({
        code: 'EMAIL_IN_USE',
        message: 'El email ya está registrado',
      });
    }

    return next(error);
  }
}
