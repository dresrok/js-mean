import { Routes } from '@angular/router';

import { UsersList } from './user-list/user-list';

// Rutas del módulo de usuarios.
export const usersRoutes: Routes = [
  {
    path: 'usuarios',
    component: UsersList,
    title: 'Usuarios | Tablero de Incidentes'
  },
];
