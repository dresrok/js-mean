import type {
  IncidentCreateInput,
  IncidentStatus,
  IncidentUpdateInput,
} from './incident.model';
import { IncidentModel } from './incident.model';
import { seedReferenceSequence } from './incident-reference.util';

// Devuelve todos los incidentes ordenados por fecha de creación.
export async function getAllIncidents() {
  return IncidentModel.find()
    .sort({ createdAt: -1 })
    .populate('reportedBy', { fullName: 1 })
    .populate('assignedTo', { fullName: 1 })
    .lean()
    .exec();
}

// Busca un incidente específico y llena las referencias necesarias.
export async function getIncidentById(id: string) {
  return IncidentModel.findById(id)
    .populate('reportedBy', { fullName: 1 })
    .populate('assignedTo', { fullName: 1 })
    .lean()
    .exec();
}

// Crea un nuevo incidente con los datos validados por el controlador.
export async function createIncident(input: IncidentCreateInput) {
  const incidentDocument = await IncidentModel.create(input);
  return incidentDocument.toObject();
}

// Actualiza un incidente existente devolviendo el documento ya sincronizado.
export async function updateIncident(id: string, changes: IncidentUpdateInput) {
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
    .lean()
    .exec();
}

// Marca un incidente como cancelado (u otro estado parcial) sin eliminarlo.
export async function cancelIncident(id: string, status: IncidentStatus) {
  return IncidentModel.findByIdAndUpdate(
    id,
    { $set: { status } },
    { new: true, runValidators: true },
  )
    .populate('reportedBy', { fullName: 1 })
    .populate('assignedTo', { fullName: 1 })
    .lean()
    .exec();
}

// Inicializa la secuencia de referencias usando el último incidente persistido.
export async function seedReferenceFromDatabase() {
  const latest = await IncidentModel.findOne().sort({ createdAt: -1 }).lean();
  seedReferenceSequence(latest?.reference);
}
