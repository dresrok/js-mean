import type { IncidentStatus } from './incident.model';
import type { NextFunction, Request, Response } from 'express';

import { hasPermission, PERMISSIONS } from '../../core/permissions';
import * as incidentService from './incidents.service';
import type { IncidentFilters } from './incidents.service';


// Devuelve el listado de incidentes según los permisos del usuario.
export async function listIncidents(req: Request, res: Response, next: NextFunction) {
  try {
    const user = req.user!;
    const filters: IncidentFilters = {};

    // Si el usuario solo puede ver sus propios incidentes, filtramos por reportedBy.
    // Agents y admins tienen INCIDENTS_READ_ALL, por lo que no aplicamos filtros.
    if (hasPermission(user.role, PERMISSIONS.INCIDENTS_READ_SELF)) {
      filters.reportedBy = user.sub;
    }

    const incidents = await incidentService.getAllIncidents(filters);
    return res.json(incidents);
  } catch (error) {
    next(error);
  }
}

// Obtiene un incidente mediante su identificador.
export async function getIncident(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const user = req.user!;
    const incident = await incidentService.getIncidentById(id);

    if (!incident) {
      return res.status(404).json({ message: 'Incident not found' });
    }

    // Si el usuario tiene permiso para ver todos los incidentes, permitimos acceso.
    if (hasPermission(user.role, PERMISSIONS.INCIDENTS_READ_ALL)) {
      return res.json(incident);
    }

    // Si el usuario solo puede ver sus propios incidentes, verificamos ownership.
    if (hasPermission(user.role, PERMISSIONS.INCIDENTS_READ_SELF)) {
      if (incident.reportedBy._id.toString() === user.sub) {
        return res.json(incident);
      }
      return res.status(403).json({
        message: 'Forbidden: You can only access your own incidents',
        code: 'FORBIDDEN',
      });
    }

    // Si el usuario no tiene ningún permiso de lectura, devolvemos 403.
    return res.status(403).json({
      message: 'Forbidden',
      code: 'FORBIDDEN',
      required: [PERMISSIONS.INCIDENTS_READ_ALL, PERMISSIONS.INCIDENTS_READ_SELF],
    });
  } catch (error) {
    next(error);
  }
}

// Crea un incidente con los datos enviados en el cuerpo.
export async function createIncident(req: Request, res: Response, next: NextFunction) {
  try {
    const user = req.user!;
    // Asignamos automáticamente el usuario autenticado como reportedBy.
    const incidentData = {
      ...req.body,
      reportedBy: user.sub,
    };
    const incident = await incidentService.createIncident(incidentData);
    res.status(201).json(incident);
  } catch (error) {
    next(error);
  }
}

// Actualiza un incidente existente validando antes su existencia.
export async function updateIncident(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const user = req.user!;

    // Si el usuario tiene permiso para actualizar cualquier incidente, permitimos.
    if (hasPermission(user.role, PERMISSIONS.INCIDENTS_UPDATE_ALL)) {
      const updated = await incidentService.updateIncident(id, req.body);
      if (!updated) {
        return res.status(404).json({ message: 'Incident not found' });
      }
      return res.json(updated);
    }

    // Si el usuario solo puede actualizar incidentes asignados, verificamos ownership.
    if (hasPermission(user.role, PERMISSIONS.INCIDENTS_UPDATE_ASSIGNED)) {
      const incident = await incidentService.getIncidentById(id);
      if (!incident) {
        return res.status(404).json({ message: 'Incident not found' });
      }

      // Verificamos que el incidente esté asignado al usuario actual.
      if (!incident.assignedTo || incident.assignedTo._id.toString() !== user.sub) {
        return res.status(403).json({
          message: 'Forbidden: You can only update incidents assigned to you',
          code: 'FORBIDDEN',
        });
      }

      const updated = await incidentService.updateIncident(id, req.body);
      return res.json(updated);
    }

    // Si el usuario no tiene ningún permiso de actualización, devolvemos 403.
    return res.status(403).json({
      message: 'Forbidden',
      code: 'FORBIDDEN',
      required: [PERMISSIONS.INCIDENTS_UPDATE_ALL, PERMISSIONS.INCIDENTS_UPDATE_ASSIGNED],
    });
  } catch (error) {
    next(error);
  }
}

// Permite cancelar un incidente sin eliminar el registro de la base de datos.
// Solo admins pueden cancelar incidentes (protegido a nivel de ruta).
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
