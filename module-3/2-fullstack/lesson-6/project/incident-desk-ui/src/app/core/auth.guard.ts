import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';

import { AuthService } from './auth.service';
import type { UserRole } from '../features/users/user.model';
import type { Permission } from './permissions';

function createLoginRedirect(router: Router) {
  return router.createUrlTree(['/login']);
}

function createForbiddenRedirect(router: Router) {
  return router.createUrlTree(['/incidentes']);
}

// Bloquea el acceso a rutas privadas si no existe sesión vigente.
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.isLoggedIn() ? true : createLoginRedirect(router);
};

// Evita que un usuario autenticado vuelva a ver la pantalla de login.
export const guestGuard: CanActivateFn = (_route, _state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.isLoggedIn() ? router.createUrlTree(['/incidentes']) : true;
};

/**
 * Factory que crea un guard para verificar si el usuario tiene un permiso específico.
 * Redirige a /incidentes si el usuario no tiene el permiso apropiado.
 *
 * @param requiredPermission - Permiso requerido para acceder a la ruta.
 * @returns CanActivateFn que verifica el permiso del usuario.
 *
 * @example
 * // Ruta protegida solo para usuarios con permiso de lectura de usuarios
 * {
 *   path: 'usuarios',
 *   canActivate: [authGuard, permissionGuard(PERMISSIONS.USERS_READ)]
 * }
 */
export function permissionGuard(requiredPermission: Permission): CanActivateFn {
  return () => {
    const auth = inject(AuthService);
    const router = inject(Router);

    if (!auth.isLoggedIn()) {
      return createLoginRedirect(router);
    }

    const hasPermission = auth.checkPermission(requiredPermission);
    return hasPermission ? true : createForbiddenRedirect(router);
  };
}
