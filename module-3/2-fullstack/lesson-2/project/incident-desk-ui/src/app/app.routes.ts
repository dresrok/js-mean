import { Routes } from '@angular/router';

import { incidentsRoutes } from './features/incidents/incidents.routes';
import { usersRoutes } from './features/users/users.routes';

export const appRoutes: Routes = [
  ...incidentsRoutes,
  ...usersRoutes,
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'incidentes'
  },
  {
    path: '**',
    redirectTo: 'incidentes'
  }
];
