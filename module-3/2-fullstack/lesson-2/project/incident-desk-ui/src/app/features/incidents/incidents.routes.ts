import { Routes } from '@angular/router';

import { IncidentDetail } from './incident-detail/incident-detail';
import { IncidentList } from './incident-list/incident-list';

export const incidentsRoutes: Routes = [
  {
    path: 'incidentes',
    children: [
      { path: '', component: IncidentList, title: 'Incidentes | Tablero' },
      { path: 'nuevo', component: IncidentDetail, title: 'Crear incidente' },
      { path: ':id/editar', component: IncidentDetail, title: 'Detalle incidente' },
    ],
  },
];
