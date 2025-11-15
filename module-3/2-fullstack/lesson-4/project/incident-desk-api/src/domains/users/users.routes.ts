import { Router } from 'express';

import { authorize } from '../../core/auth.middleware';
import { PERMISSIONS } from '../../core/permissions';
import { listUsers, createUser } from './users.controller';

// Router exclusivamente para operaciones sobre usuarios.
export const usersRouter = Router();

// Solo los administradores pueden acceder a las operaciones de usuarios.
usersRouter.get('/', authorize(PERMISSIONS.USERS_READ_ALL), listUsers);
