import type { User } from '../types/user';

export const users: User[] = [
  {
    id: 'u-1000',
    fullName: 'Alex Mendoza',
    email: 'alex.mendoza@example.com',
    role: 'reporter',
    isActive: true,
  },
  {
    id: 'u-1001',
    fullName: 'Beatriz Ramos',
    email: 'beatriz.ramos@example.com',
    role: 'agent',
    isActive: true,
  },
  {
    id: 'u-1002',
    fullName: 'Camila Duarte',
    email: 'camila.duarte@example.com',
    role: 'agent',
    isActive: true,
  },
  {
    id: 'u-1003',
    fullName: 'Diego Torres',
    email: 'diego.torres@example.com',
    role: 'admin',
    isActive: true,
  },
  {
    id: 'u-1004',
    fullName: 'Elena Pineda',
    email: 'elena.pineda@example.com',
    role: 'reporter',
    isActive: false,
  },
];
