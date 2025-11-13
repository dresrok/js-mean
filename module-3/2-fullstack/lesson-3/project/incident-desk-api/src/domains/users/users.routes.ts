import { Router } from 'express';

import { listUsers } from './users.controller';

// Router exclusivamente para operaciones sobre usuarios.
export const usersRouter = Router();

usersRouter.get('/', listUsers);
