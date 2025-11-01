import { Schema, model, type Document } from 'mongoose';

import { buildReference, seedReferenceSequence } from './incident-reference.util';

export type IncidentSeverity = 'low' | 'medium' | 'high' | 'critical';

export type IncidentStatus = 'new' | 'ack' | 'in_progress' | 'resolved' | 'closed' | 'cancelled';

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

export const IncidentModel = model<IncidentDocument>('Incident', incidentSchema);

type IncidentMutableFields = Pick<
  IncidentDocument,
  'title' | 'description' | 'severity' | 'status' | 'reportedBy' | 'assignedTo' | 'tags'
>;

export type IncidentCreateInput = IncidentMutableFields;
export type IncidentUpdateInput = IncidentMutableFields;
