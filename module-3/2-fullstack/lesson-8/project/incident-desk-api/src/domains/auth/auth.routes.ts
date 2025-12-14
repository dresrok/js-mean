import { Router } from 'express';

import { loginRateLimiter } from '../../core/rate-limiters';

import { login, register } from './auth.controller';

// Router dedicado a las rutas de autenticación.
export const authRouter = Router();

// Endpoint público para iniciar sesión y obtener el token de acceso.
authRouter.post('/login', loginRateLimiter, login);

// Endpoint público para registrar un usuario y devolver una sesión autenticada.
authRouter.post('/register', loginRateLimiter, register);