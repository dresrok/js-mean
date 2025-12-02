import type { UserRole } from '../domains/users/user.model';

// Definición de todos los permisos disponibles en el sistema.
export const PERMISSIONS = {
  // Permisos de incidentes
  INCIDENTS_CREATE: 'incidents:create',
  INCIDENTS_READ_SELF: 'incidents:read:self',
  INCIDENTS_READ_ALL: 'incidents:read:all',
  INCIDENTS_UPDATE_ASSIGNED: 'incidents:update:assigned',
  INCIDENTS_UPDATE_ALL: 'incidents:update:all',
  INCIDENTS_CANCEL: 'incidents:cancel',
  INCIDENTS_DELETE: 'incidents:delete',
  // Permisos de usuarios
  USERS_READ_ALL: 'users:read:all',
} as const;

// Tipo que representa cualquiera de los permisos definidos.
export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS];

// Matriz de permisos por rol: define qué puede hacer cada rol en el sistema.
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  reporter: [
    PERMISSIONS.INCIDENTS_CREATE,
    PERMISSIONS.INCIDENTS_READ_SELF,
  ],
  agent: [
    PERMISSIONS.INCIDENTS_READ_ALL,
    PERMISSIONS.INCIDENTS_UPDATE_ASSIGNED,
  ],
  admin: [
    PERMISSIONS.INCIDENTS_CREATE,
    PERMISSIONS.INCIDENTS_READ_ALL,
    PERMISSIONS.INCIDENTS_UPDATE_ALL,
    PERMISSIONS.INCIDENTS_CANCEL,
    PERMISSIONS.INCIDENTS_DELETE,
    PERMISSIONS.USERS_READ_ALL,
  ],
};

// Verifica si un usuario con un rol específico posee un permiso determinado.
export function hasPermission(role: UserRole, permission: Permission): boolean {
  const permissions = ROLE_PERMISSIONS[role];
  return permissions.includes(permission);
}

// Verifica si un usuario con un rol específico posee todos los permisos requeridos.
export function hasAllPermissions(role: UserRole, requiredPermissions: Permission[]): boolean {
  return requiredPermissions.every((permission) => hasPermission(role, permission));
}


