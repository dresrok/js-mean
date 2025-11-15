import { Router } from 'express';

import { login } from './auth.controller';

// Router dedicado a las rutas de autenticación.
export const authRouter = Router();

// Endpoint público para iniciar sesión y obtener el token de acceso.
authRouter.post('/login', login);
