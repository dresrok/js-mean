import type { JwtPayload } from 'jsonwebtoken';

import type { UserRole, UserRecord } from '../users/user.model';


// Payload esperado al recibir credenciales desde el cliente.
export interface LoginPayload {
  email: string;
  password: string;
}

// Estructura devuelta al frontend tras un inicio de sesión exitoso.
export interface AuthResponse {
  accessToken: string;
  user: UserRecord;
}

// Claims mínimos firmados dentro del JWT.
export interface AuthTokenPayload extends JwtPayload {
  sub: string;
  name: string;
  email: string;
  role: UserRole;
}
