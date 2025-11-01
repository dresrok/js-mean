import { Router } from 'express';

import {
  cancelIncident,
  createIncident,
  getIncident,
  listIncidents,
  updateIncident,
} from './incidents.controller';

// Router dedicado a la funcionalidad de incidentes.
export const incidentsRouter = Router();

// Lista y creación comparten el mismo endpoint base.
incidentsRouter.route('/')
  .get(listIncidents)
  .post(createIncident);

// Rutas parametrizadas para consultar, actualizar o cancelar un incidente.
incidentsRouter.route('/:id')
  .get(getIncident)
  .put(updateIncident)
  .patch(cancelIncident);
