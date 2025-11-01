export type UserRole = 'reporter' | 'agent' | 'admin';

export interface User {
  _id: string;
  fullName: string;
  email: string;
  role: UserRole;
  isActive: boolean;
}
