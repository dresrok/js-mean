export type TeamMemberAvailability = 'disponible' | 'ocupado' | 'ausente' | 'desconectado';

export interface TeamMember {
  id: number;
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
