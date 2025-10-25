export type IncidentStatus =
  | 'new'
  | 'ack'
  | 'in_progress'
  | 'resolved'
  | 'closed'
  | 'cancelled';

export type IncidentSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface Incident {
  id: string;
  reference: string;
  title: string;
  description: string;
  status: IncidentStatus;
  severity: IncidentSeverity;
  reportedBy: string;
  reportedByName: string;
  assignedTo?: string;
  assignedToName?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}
