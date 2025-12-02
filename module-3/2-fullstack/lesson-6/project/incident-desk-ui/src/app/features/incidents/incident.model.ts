// Estados posibles de un incidente en su ciclo de vida.
export type IncidentStatus =
  | 'new'
  | 'ack'
  | 'in_progress'
  | 'resolved'
  | 'closed'
  | 'cancelled';

// Niveles de severidad que clasifican la urgencia de un incidente.
export type IncidentSeverity = 'low' | 'medium' | 'high' | 'critical';

// Representación simplificada de un usuario dentro del contexto de un incidente.
export interface IncidentUser {
  _id: string;
  fullName: string;
}

// Modelo completo de un incidente tal como lo devuelve el backend.
export interface Incident {
  _id: string;
  title: string;
  description: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  reportedBy: IncidentUser;
  assignedTo?: IncidentUser;
  tags: string[];
  reference: string;
  createdAt: string;
  updatedAt: string;
}

// Payload para crear un nuevo incidente.
export interface IncidentCreateRequest {
  title: string;
  description: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  reportedBy: string;
  assignedTo?: string;
  tags: string[];
}

// Payload para actualizar un incidente existente.
export type IncidentUpdateRequest = IncidentCreateRequest;
