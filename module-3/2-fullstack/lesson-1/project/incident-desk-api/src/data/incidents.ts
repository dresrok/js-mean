import type { Incident } from '../types/incident';
import { users } from './users';

const userById = new Map(users.map((user) => [user.id, user]));

function getUserById(userId: string) {
  const user = userById.get(userId);
  if (!user) {
    throw new Error(`Unknown user id ${userId}`);
  }
  return user;
}

export const incidents: Incident[] = [
  {
    id: 'inc-2000',
    reference: 'INC-2024-0001',
    title: 'Falla de conectividad VPN en la región LATAM',
    description:
      'Colaboradores en la región LATAM no pueden autenticarse contra el gateway VPN. Operaciones reportó el incidente inicial.',
    status: 'new',
    severity: 'critical',
    reportedBy: 'u-1000',
    reportedByName: getUserById('u-1000').fullName,
    tags: ['vpn', 'red'],
    createdAt: '2024-05-01T13:35:00.000Z',
    updatedAt: '2024-05-01T13:35:00.000Z',
  },
  {
    id: 'inc-2001',
    reference: 'INC-2024-0002',
    title: 'Picos de errores en el servicio de checkout',
    description:
      'Monitoreo detectó aumento de respuestas 500 en POST /checkout. Aún no hay reportes de clientes.',
    status: 'ack',
    severity: 'high',
    reportedBy: 'u-1004',
    reportedByName: getUserById('u-1004').fullName,
    assignedTo: 'u-1001',
    assignedToName: getUserById('u-1001').fullName,
    tags: ['backend', 'pagos'],
    createdAt: '2024-04-29T22:10:00.000Z',
    updatedAt: '2024-04-30T10:21:00.000Z',
  },
  {
    id: 'inc-2002',
    reference: 'INC-2024-0003',
    title: 'Portal de clientes con tiempos de respuesta lentos',
    description:
      'El SLA del percentil 95 de latencia fue sobrepasado. Se sospecha del despliegue realizado la noche anterior.',
    status: 'in_progress',
    severity: 'medium',
    reportedBy: 'u-1000',
    reportedByName: getUserById('u-1000').fullName,
    assignedTo: 'u-1002',
    assignedToName: getUserById('u-1002').fullName,
    tags: ['rendimiento'],
    createdAt: '2024-04-20T09:45:00.000Z',
    updatedAt: '2024-04-21T08:10:00.000Z',
  },
  {
    id: 'inc-2003',
    reference: 'INC-2024-0004',
    title: 'Acumulación de notificaciones por correo',
    description:
      'Campaña de marketing quedó en estado pendiente y no envía correos. Causa raíz en investigación.',
    status: 'resolved',
    severity: 'low',
    reportedBy: 'u-1004',
    reportedByName: getUserById('u-1004').fullName,
    assignedTo: 'u-1001',
    assignedToName: getUserById('u-1001').fullName,
    tags: ['email', 'ops'],
    createdAt: '2024-03-17T11:00:00.000Z',
    updatedAt: '2024-03-17T16:35:00.000Z',
  },
];
