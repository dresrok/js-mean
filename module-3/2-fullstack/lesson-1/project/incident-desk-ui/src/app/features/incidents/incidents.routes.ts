import { Routes } from '@angular/router';

import { IncidentList } from './incident-list/incident-list';

export const incidentsRoutes: Routes = [
  {
    path: 'incidentes',
    component: IncidentList,
    title: 'Incidentes | Tablero de Incidentes'
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'incidentes'
  },
];
