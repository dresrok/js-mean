export type EmployeeAvailability = 'disponible' | 'ocupado' | 'ausente' | 'desconectado';

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
  availability: EmployeeAvailability;
  currentProject?: string;
  joinDate: Date;
}
