export type IncidentStatus =
  | 'new'
  | 'ack'
  | 'in_progress'
  | 'resolved'
  | 'closed'
  | 'cancelled';

export type IncidentSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface IncidentUser {
  _id: string;
  fullName: string;
}

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

export interface IncidentCreateRequest {
  title: string;
  description: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  reportedBy: string;
  assignedTo?: string;
  tags: string[];
}

export type IncidentUpdateRequest = IncidentCreateRequest;
