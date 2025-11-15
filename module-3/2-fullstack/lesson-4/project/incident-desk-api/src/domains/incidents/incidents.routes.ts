import { Router } from 'express';

import { authorize } from '../../core/auth.middleware';
import { PERMISSIONS } from '../../core/permissions';
import {
  cancelIncident,
  createIncident,
  getIncident,
  listIncidents,
  updateIncident,
  deleteIncident,
} from './incidents.controller';

// Router dedicado a la funcionalidad de incidentes.
export const incidentsRouter = Router();

// Lista y creación comparten el mismo endpoint base.
incidentsRouter.route('/')
  .get(listIncidents) // Requiere INCIDENTS_READ_SELF o INCIDENTS_READ_ALL (verificado en el controlador)
  .post(authorize(PERMISSIONS.INCIDENTS_CREATE), createIncident);

// Rutas parametrizadas para consultar, actualizar o cancelar un incidente.
incidentsRouter.route('/:id')
  .get(getIncident) // Requiere INCIDENTS_READ_SELF o INCIDENTS_READ_ALL (verificado en el controlador)
  .put(updateIncident) // Requiere INCIDENTS_UPDATE_ASSIGNED o INCIDENTS_UPDATE_ALL (verificado en el controlador)
  .patch(authorize(PERMISSIONS.INCIDENTS_CANCEL), cancelIncident) // Solo admins pueden cancelar
  .delete(authorize(PERMISSIONS.INCIDENTS_DELETE), deleteIncident);
