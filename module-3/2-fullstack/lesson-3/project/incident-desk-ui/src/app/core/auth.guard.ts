import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';

import { AuthService } from './auth.service';

function createLoginRedirect(router: Router) {
  return router.createUrlTree(['/login']);
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
