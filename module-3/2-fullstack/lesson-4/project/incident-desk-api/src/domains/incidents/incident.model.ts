import { Schema, model, type Document } from 'mongoose';

import { buildReference, seedReferenceSequence } from './incident-reference.util';
import type { UserRecord } from '../users/user.model';

// Niveles de severidad disponibles para clasificar incidentes.
export type IncidentSeverity = 'low' | 'medium' | 'high' | 'critical';

// Estados del ciclo de vida de un incidente.
export type IncidentStatus = 'new' | 'ack' | 'in_progress' | 'resolved' | 'closed' | 'cancelled';

// Documento de Mongoose que representa un incidente en la base de datos.
export interface IncidentDocument extends Document {
  reference: string;
  title: string;
  description: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  reportedBy: Schema.Types.ObjectId;
  assignedTo?: Schema.Types.ObjectId;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Schema de Mongoose con validaciones y restricciones para incidentes.
const incidentSchema = new Schema<IncidentDocument>(
  {
    reference: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      match: /^INC-\d{4}-\d{4}$/,
    },
    title: { type: String, required: true, minlength: 8, maxlength: 120 },
    description: { type: String, required: true },
    severity: {
      type: String,
      required: true,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'low',
    },
    status: {
      type: String,
      required: true,
      enum: ['new', 'ack', 'in_progress', 'resolved', 'closed', 'cancelled'],
      default: 'new',
    },
    reportedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
    tags: { type: [String], default: [] },
  },
  { timestamps: true }
);

// Antes de validar asignamos un código secuencial si el documento es nuevo.
incidentSchema.pre('validate', async function ensureReference() {
  if (!this.reference) {
    // Retrieve the latest incident by reference in descending order
    const latestIncident = await IncidentModel.findOne()
      .sort({ reference: -1 })
      .select('reference')
      .lean();

    if (latestIncident) {
      seedReferenceSequence(latestIncident.reference);
    }

    this.reference = buildReference();
  }
});

// Modelo de Mongoose para operaciones CRUD sobre incidentes.
export const IncidentModel = model<IncidentDocument>('Incident', incidentSchema);

// Tipo auxiliar que selecciona solo los campos modificables del documento.
type IncidentMutableFields = Pick<
  IncidentDocument,
  'title' | 'description' | 'severity' | 'status' | 'reportedBy' | 'assignedTo' | 'tags'
>;

// Payload esperado al crear un nuevo incidente.
export type IncidentCreateInput = IncidentMutableFields;
// Payload esperado al actualizar un incidente existente.
export type IncidentUpdateInput = IncidentMutableFields;

// Tipo para usuarios populados en incidentes (campos seleccionados de UserRecord).
type PopulatedUser = Pick<UserRecord, '_id' | 'fullName'>;

// Tipo para incidentes con campos populados después de usar lean().
export interface IncidentRecord {
  _id: string;
  reference: string;
  title: string;
  description: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  reportedBy: PopulatedUser;
  assignedTo?: PopulatedUser;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
};
