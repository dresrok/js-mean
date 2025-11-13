import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';

import { AuthService } from '../../auth.service';

// Layout autenticado que agrupa toolbar, navegación y botón de logout para todas las pantallas privadas.
@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, MatToolbarModule, MatButtonModule, MatIconModule, MatMenuModule],
  templateUrl: './auth-layout.html',
  styleUrl: './auth-layout.scss',
})
export class AuthLayout {
  private readonly auth = inject(AuthService);

  // Exponemos la sesión para mostrar el nombre del usuario y controlar el botón de salida.
  readonly session = this.auth.session;

  readonly links = [
    { label: 'Incidentes', path: '/incidentes', icon: 'report_problem' },
    { label: 'Usuarios', path: '/usuarios', icon: 'group' },
  ];

  logout(): void {
    this.auth.logout({ notify: true });
  }
}
