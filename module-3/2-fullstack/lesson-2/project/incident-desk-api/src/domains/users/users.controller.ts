import type { NextFunction, Request, Response } from 'express';

import * as usersService from './users.service';
import { UserRole } from './user.model';

// Devuelve la lista de usuarios filtrada opcionalmente por rol.
export async function listUsers(req: Request, res: Response, next: NextFunction) {
  try {
    const role = req.query.role?.toString();
    const users = await usersService.listUsers({ role });
    res.json(users);
  } catch (error) {
    next(error);
  }
}
