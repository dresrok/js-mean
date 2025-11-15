import type {
  IncidentCreateInput,
  IncidentRecord,
  IncidentStatus,
  IncidentUpdateInput,
} from './incident.model';
import { IncidentModel } from './incident.model';
import { seedReferenceSequence } from './incident-reference.util';

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
