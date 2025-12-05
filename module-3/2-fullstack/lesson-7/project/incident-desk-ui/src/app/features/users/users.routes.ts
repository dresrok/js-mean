import { Routes } from '@angular/router';

import { permissionGuard } from '../../core/auth.guard';
import { PERMISSIONS } from '../../core/permissions';
import { UsersList } from './user-list/user-list';

/**
 * Rutas del módulo de usuarios.
 * Protegidas con permissionGuard para asegurar que solo usuarios con el permiso
 * USERS_READ (admins) puedan acceder.
 */
export const usersRoutes: Routes = [
  {
    path: 'usuarios',
    component: UsersList,
    canActivate: [permissionGuard(PERMISSIONS.USERS_READ_ALL)],
    title: 'Usuarios | Tablero de Incidentes',
  },
];
