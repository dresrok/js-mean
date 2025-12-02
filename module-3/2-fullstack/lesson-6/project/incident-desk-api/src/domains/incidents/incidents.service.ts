import { Types } from 'mongoose';

import { seedReferenceSequence } from './incident-reference.util';
import type {
  IncidentCreateInput,
  IncidentRecord,
  IncidentStatus,
  IncidentUpdateInput,
} from './incident.model';
import { IncidentModel } from './incident.model';

// Filtros opcionales para consultar incidentes.
export type IncidentFilters = {
  reportedBy?: string;
  assignedTo?: string;
};

// Devuelve incidentes con filtros opcionales, ordenados por fecha de creación.
export async function getAllIncidents(filters: IncidentFilters = {}): Promise<IncidentRecord[]> {
  const query: Record<string, unknown> = {};

  if (filters.reportedBy) {
    query.reportedBy = filters.reportedBy;
  }

  if (filters.assignedTo) {
    query.assignedTo = filters.assignedTo;
  }

  return IncidentModel.find(query)
    .sort({ createdAt: -1 })
    .populate('reportedBy', { fullName: 1 })
    .populate('assignedTo', { fullName: 1 })
    .lean<IncidentRecord[]>()
    .exec();
}

/**
 * Variante optimizada de getAllIncidents usando aggregation.
 * Usa $lookup para hacer joins eficientes en una sola query.
 *
 * Ventajas sobre populate:
 * - Una sola query a MongoDB (vs 1 + N queries)
 * - Mayor control sobre proyecciones
 * - Mejor performance con grandes volúmenes
 */
export async function getAllIncidentsOptimized(
  filters: IncidentFilters = {}
): Promise<IncidentRecord[]> {
  const matchStage: Record<string, unknown> = {};

  if (filters.reportedBy) {
    matchStage.reportedBy = new Types.ObjectId(filters.reportedBy);
  }

  if (filters.assignedTo) {
    matchStage.assignedTo = new Types.ObjectId(filters.assignedTo);
  }

  return IncidentModel.aggregate([
    // Stage 1: Filtrar incidentes
    { $match: matchStage },

    // Stage 2: Ordenar por fecha (usa índice si existe)
    { $sort: { createdAt: -1 } },

    // Stage 3: Lookup (JOIN) con users para reportedBy
    {
      $lookup: {
        from: 'users',
        localField: 'reportedBy',
        foreignField: '_id',
        as: 'reportedByUser',
        // Pipeline interno para proyectar solo campos necesarios
        pipeline: [{ $project: { fullName: 1 } }],
      },
    },

    // Stage 4: Lookup con users para assignedTo
    {
      $lookup: {
        from: 'users',
        localField: 'assignedTo',
        foreignField: '_id',
        as: 'assignedToUser',
        // Pipeline interno para proyectar solo campos necesarios
        pipeline: [{ $project: { fullName: 1 } }],
      },
    },

    // Stage 5: Reestructurar para coincidir con IncidentRecord
    {
      $project: {
        _id: { $toString: '$_id' },
        reference: 1,
        title: 1,
        description: 1,
        severity: 1,
        status: 1,
        tags: 1,
        createdAt: 1,
        updatedAt: 1,
        // $arrayElemAt porque lookup retorna array
        reportedBy: { $arrayElemAt: ['$reportedByUser', 0] },
        assignedTo: { $arrayElemAt: ['$assignedToUser', 0] },
      },
    },

    // Stage 6: Transformar IDs de usuarios a string
    {
      $addFields: {
        'reportedBy._id': { $toString: '$reportedBy._id' },
        'assignedTo._id': { $toString: '$assignedTo._id' },
      },
    },
  ]).exec();
}

// Busca un incidente específico y llena las referencias necesarias.
export async function getIncidentById(id: string): Promise<IncidentRecord | null> {
  return IncidentModel.findById(id)
    .populate('reportedBy', { fullName: 1 })
    .populate('assignedTo', { fullName: 1 })
    .lean<IncidentRecord>()
    .exec();
}

// Crea un nuevo incidente con los datos validados por el controlador.
export async function createIncident(input: IncidentCreateInput) {
  const incidentDocument = await IncidentModel.create(input);
  return incidentDocument.toObject();
}

// Actualiza un incidente existente devolviendo el documento ya sincronizado.
export async function updateIncident(id: string, changes: IncidentUpdateInput): Promise<IncidentRecord | null> {
  return IncidentModel.findByIdAndUpdate(
    id,
    { $set: changes },
    {
      new: true,
      runValidators: true,
    },
  )
    .populate('reportedBy', { fullName: 1 })
    .populate('assignedTo', { fullName: 1 })
    .lean<IncidentRecord>()
    .exec();
}

// Marca un incidente como cancelado (u otro estado parcial) sin eliminarlo.
export async function cancelIncident(id: string, status: IncidentStatus): Promise<IncidentRecord | null> {
  return IncidentModel.findByIdAndUpdate(
    id,
    { $set: { status } },
    { new: true, runValidators: true },
  )
    .populate('reportedBy', { fullName: 1 })
    .populate('assignedTo', { fullName: 1 })
    .lean<IncidentRecord>()
    .exec();
}

// Permite eliminar un incidente de la base de datos.
export async function deleteIncident(id: string) {
  return IncidentModel.findByIdAndDelete(id).exec();
}

// Inicializa la secuencia de referencias usando el último incidente persistido.
export async function seedReferenceFromDatabase() {
  const latest = await IncidentModel.findOne().sort({ createdAt: -1 }).lean();
  seedReferenceSequence(latest?.reference);
}
