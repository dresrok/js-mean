export type UserRole = 'reporter' | 'agent' | 'admin';

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  isActive: boolean;
}
