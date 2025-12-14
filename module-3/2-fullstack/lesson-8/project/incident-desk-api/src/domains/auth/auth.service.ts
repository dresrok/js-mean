import bcrypt from 'bcryptjs';
import jwt, { type SignOptions } from 'jsonwebtoken';

import { UserDocumentLean, UserModel, UserRecord, toUserRecord } from '../users/user.model';

import { InvalidCredentialsError, InvalidTokenError } from './auth.exceptions';
import type { AuthResponse, AuthTokenPayload } from './auth.types';

// Genera un JWT firmado con la configuración actual de expiración.
export function createAccessToken(user: UserRecord): string {
  const secret = process.env.JWT_ACCESS_SECRET;

  if (!secret) {
    throw new Error('JWT_ACCESS_SECRET is not configured');
  }

  // Solo incluimos claims esenciales para preservar un token pequeño y sin datos sensibles.
  const payload: AuthTokenPayload = {
    sub: user._id.toString(),
    name: user.fullName,
    email: user.email,
    role: user.role,
  };

  // Permite ajustar la vigencia del token desde variables de entorno.
  const expiresInEnv = process.env.JWT_EXPIRES_IN;
  const signOptions: SignOptions = {
    expiresIn: (expiresInEnv ?? '15m') as SignOptions['expiresIn'],
  };

  return jwt.sign(payload, secret, signOptions);
}

// Valida credenciales contra la base de datos y devuelve token + usuario saneado.
export async function authenticateUser(email: string, password: string): Promise<AuthResponse> {
  const normalizedEmail = email.trim().toLowerCase();
  // Se trabaja con documentos "lean" para evitar instancias completas de Mongoose en cada login.
  const user = await UserModel.findOne({ email: normalizedEmail }).lean<UserDocumentLean>().exec();

  if (!user) {
    // Si el usuario no existe, se lanza un error de credenciales inválidas.
    throw new InvalidCredentialsError();
  }

  if (!user.isActive) {
    // Si el usuario no está activo, se lanza un error de credenciales inválidas.
    throw new InvalidCredentialsError();
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    // Si la contraseña no coincide, se lanza un error de credenciales inválidas.
    throw new InvalidCredentialsError();
  }

  const userRecord = toUserRecord(user);
  const accessToken = createAccessToken(userRecord);

  return {
    accessToken,
    user: userRecord,
  };
}

type RegisterUserPayload = {
  fullName: string;
  email: string;
  password: string;
};

// Registra un usuario público (rol fijo: reporter) y devuelve una sesión autenticada.
export async function registerUser(payload: RegisterUserPayload): Promise<AuthResponse> {
  const normalizedEmail = payload.email.trim().toLowerCase();
  const fullName = payload.fullName.trim();

  const created = await UserModel.create({
    fullName,
    email: normalizedEmail,
    password: payload.password,
    role: 'reporter',
  });

  // Convertimos a un objeto plano para reutilizar el sanitizador existente.
  const userRecord = toUserRecord(created.toObject() as unknown as UserDocumentLean);
  const accessToken = createAccessToken(userRecord);

  return {
    accessToken,
    user: userRecord,
  };
}

// Verifica la firma del token recibido y extrae el payload para otras capas.
export function verifyAccessToken(token: string): AuthTokenPayload {
  try {
    const secret = process.env.JWT_ACCESS_SECRET;

    if (!secret) {
      throw new Error('JWT_ACCESS_SECRET is not configured');
    }

    const decoded = jwt.verify(token, secret);

    if (typeof decoded === 'string') {
      throw new InvalidTokenError();
    }

    const payload = decoded as AuthTokenPayload;

    if (!payload.sub || !payload.email || !payload.role) {
      throw new InvalidTokenError();
    }

    return payload;
  } catch (error) {
    throw new InvalidTokenError();
  }
}
