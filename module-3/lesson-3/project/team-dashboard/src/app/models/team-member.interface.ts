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
  availability: 'disponible' | 'ocupado' | 'ausente' | 'desconectado';
  currentProject?: string;
  joinDate: Date;
}

export type EmployeeAvailability = 'disponible' | 'ocupado' | 'ausente' | 'desconectado';
