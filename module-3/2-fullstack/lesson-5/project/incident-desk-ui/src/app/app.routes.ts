import { Routes } from '@angular/router';

import { authGuard, guestGuard } from './core/auth.guard';
import { AuthLayout } from './core/layouts/auth-layout/auth-layout';
import { incidentsRoutes } from './features/incidents/incidents.routes';
import { usersRoutes } from './features/users/users.routes';

export const appRoutes: Routes = [
  {
    path: '',
    // Ruta raíz protegida por authGuard. Requiere autenticación para acceder.
    // AuthLayout actúa como contenedor compartido para las rutas de incidentes y usuarios.
    // Por defecto redirige a 'incidentes'.
    component: AuthLayout,
    canActivate: [authGuard],
    children: [
      ...incidentsRoutes,
      ...usersRoutes,
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'incidentes',
      },
    ],
  },
  {
    path: 'login',
    // Ruta pública accesible solo para usuarios no autenticados (guestGuard).
    // Se carga de forma diferida para reducir el tamaño del bundle inicial.
    canActivate: [guestGuard],
    loadComponent: () => import('./features/login/login-form/login-form').then((m) => m.LoginForm),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
