import type { IncidentStatus } from './incident.model';
import type { NextFunction, Request, Response } from 'express';

import * as incidentService from './incidents.service';


// Devuelve el listado completo de incidentes.
export async function listIncidents(_req: Request, res: Response, next: NextFunction) {
  try {
    const incidents = await incidentService.getAllIncidents();
    res.json(incidents);
  } catch (error) {
    next(error);
  }
}

// Obtiene un incidente mediante su identificador.
export async function getIncident(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const incident = await incidentService.getIncidentById(id);

    if (!incident) {
      return res.status(404).json({ message: 'Incident not found' });
    }

    return res.json(incident);
  } catch (error) {
    next(error);
  }
}

// Crea un incidente con los datos enviados en el cuerpo.
export async function createIncident(req: Request, res: Response, next: NextFunction) {
  try {
    const incident = await incidentService.createIncident(req.body);
    res.status(201).json(incident);
  } catch (error) {
    next(error);
  }
}

// Actualiza un incidente existente validando antes su existencia.
export async function updateIncident(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const updated = await incidentService.updateIncident(id, req.body);

    if (!updated) {
      return res.status(404).json({ message: 'Incident not found' });
    }

    return res.json(updated);
  } catch (error) {
    next(error);
  }
}

// Permite cancelar un incidente sin eliminar el registro de la base de datos.
export async function cancelIncident(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { status } = req.body as { status?: IncidentStatus };

    if (!status) {
      return res.status(400).json({ message: 'Status is required to cancel an incident' });
    }

    const cancelled = await incidentService.cancelIncident(id, status);

    if (!cancelled) {
      return res.status(404).json({ message: 'Incident not found' });
    }

    return res.json(cancelled);
  } catch (error) {
    next(error);
  }
}

// Permite eliminar un incidente de la base de datos.
export async function deleteIncident(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    await incidentService.deleteIncident(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
