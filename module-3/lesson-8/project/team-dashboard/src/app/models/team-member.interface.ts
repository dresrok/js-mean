export type TeamMemberAvailability = 'disponible' | 'ocupado' | 'ausente' | 'desconectado';

export interface TeamMember {
  id: string; // JSON Server v1.x generates 4-char hex strings (e.g., "4aca", "51fd")
  name: string;
  role: string;
  department: string;
  email: string;
  phone: string;
  avatar: string;
  experience: number;
  skills: string[];
  availability: TeamMemberAvailability;
  currentProject?: string;
  joinDate: Date;
}
