import { Routes } from '@angular/router';

import { UsersList } from './user-list/user-list';

export const usersRoutes: Routes = [
  {
    path: 'usuarios',
    component: UsersList,
    title: 'Usuarios | Tablero de Incidentes'
  },
];
