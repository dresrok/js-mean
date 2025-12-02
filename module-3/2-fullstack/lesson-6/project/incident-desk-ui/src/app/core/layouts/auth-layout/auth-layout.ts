import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';

import { AuthService } from '../../auth.service';
import { PERMISSIONS, type Permission } from '../../permissions';

interface NavigationLink {
  label: string;
  path: string;
  icon: string;
  permissions?: Permission[];
}

/**
 * Layout autenticado que agrupa toolbar, navegación contextual por rol y botón de logout.
 * Los enlaces de navegación se filtran automáticamente según los permisos del usuario.
 */
@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
  ],
  templateUrl: './auth-layout.html',
  styleUrl: './auth-layout.scss',
})
export class AuthLayout {
  private readonly auth = inject(AuthService);

  // Exponemos la sesión para mostrar el nombre del usuario y controlar el botón de salida.
  readonly session = this.auth.session;

  // Define todos los enlaces posibles con sus permisos requeridos
  private readonly allLinks: NavigationLink[] = [
    {
      label: 'Incidentes',
      path: '/incidentes',
      icon: 'report_problem',
      permissions: [PERMISSIONS.INCIDENTS_READ_ALL, PERMISSIONS.INCIDENTS_READ_SELF],
    },
    {
      label: 'Usuarios',
      path: '/usuarios',
      icon: 'group',
      permissions: [PERMISSIONS.USERS_READ_ALL],
    },
  ];

  // Computed signal que filtra los enlaces según los permisos del usuario
  readonly links = computed(() => {
    return this.allLinks.filter((link) => {
      // Si el enlace no requiere permisos especiales, siempre es visible
      if (!link.permissions || link.permissions.length === 0) {
        return true;
      }
      // Verifica si el usuario tiene al menos uno de los permisos requeridos
      return this.auth.checkAnyPermission(link.permissions);
    });
  });

  logout(): void {
    this.auth.logout({ notify: true });
  }
}
