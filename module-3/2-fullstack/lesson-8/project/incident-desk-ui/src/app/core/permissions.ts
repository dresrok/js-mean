import type { UserRole } from '../features/users/user.model';

// Define los permisos disponibles en el sistema, sincronizados con el backend.
export const PERMISSIONS = {
  INCIDENTS_CREATE: 'incidents:create',
  INCIDENTS_READ_SELF: 'incidents:read:self',
  INCIDENTS_READ_ALL: 'incidents:read:all',
  INCIDENTS_UPDATE_ASSIGNED: 'incidents:update:assigned',
  INCIDENTS_UPDATE_ALL: 'incidents:update:all',
  INCIDENTS_CANCEL: 'incidents:cancel',
  INCIDENTS_DELETE: 'incidents:delete',
  USERS_READ_ALL: 'users:read:all',
} as const;

// Tipo inferido de los valores de PERMISSIONS para garantizar type-safety.
export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

// Matriz que mapea cada rol a sus permisos correspondientes.
// Debe estar sincronizada con la matriz del backend para consistencia.
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
    PERMISSIONS.INCIDENTS_READ_SELF,
    PERMISSIONS.INCIDENTS_READ_ALL,
    PERMISSIONS.INCIDENTS_UPDATE_ASSIGNED,
    PERMISSIONS.INCIDENTS_UPDATE_ALL,
    PERMISSIONS.INCIDENTS_CANCEL,
    PERMISSIONS.INCIDENTS_DELETE,
    PERMISSIONS.USERS_READ_ALL,
  ],
};

/**
 * Verifica si un rol tiene un permiso específico.
 * @param role - El rol del usuario.
 * @param permission - El permiso a verificar.
 * @returns true si el rol tiene el permiso, false en caso contrario.
 */
export function hasPermission(role: UserRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role].includes(permission);
}

/**
 * Verifica si un rol tiene todos los permisos especificados.
 * @param role - El rol del usuario.
 * @param permissions - Array de permisos a verificar.
 * @returns true si el rol tiene todos los permisos, false en caso contrario.
 */
export function hasAllPermissions(role: UserRole, permissions: Permission[]): boolean {
  return permissions.every((permission) => hasPermission(role, permission));
}

/**
 * Verifica si un rol tiene al menos uno de los permisos especificados.
 * @param role - El rol del usuario.
 * @param permissions - Array de permisos a verificar.
 * @returns true si el rol tiene al menos uno de los permisos, false en caso contrario.
 */
export function hasAnyPermission(role: UserRole, permissions: Permission[]): boolean {
  return permissions.some((permission) => hasPermission(role, permission));
}
