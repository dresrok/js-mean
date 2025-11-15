// Roles disponibles en el sistema de gestión de incidentes.
export type UserRole = 'reporter' | 'agent' | 'admin';

// Modelo de usuario tal como lo devuelve el backend.
export interface User {
  _id: string;
  fullName: string;
  email: string;
  role: UserRole;
  isActive: boolean;
}
