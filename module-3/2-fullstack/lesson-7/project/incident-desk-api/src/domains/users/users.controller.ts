import type { NextFunction, Request, Response } from 'express';

import { invalidateCache } from '../../core/cache.middleware';

import * as usersService from './users.service';


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

export async function createUser(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await usersService.createUser(req.body);
    
    // Invalidar caché después de crear un usuario
    invalidateCache();
    
    res.json(user);
  } catch (error) {
    next(error);
  }
}
