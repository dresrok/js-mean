import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  template: `
    <div class="layout">
      <header class="app-header">
        <div class="header-container">
          <div class="logo">
            <span class="logo-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>
            </span>
            <span class="logo-text">GestorMetas</span>
          </div>
          <nav>
            <a routerLink="/metas" routerLinkActive="active" class="nav-link">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 4px; vertical-align: text-bottom;"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              Mis Metas
            </a>
            <button (click)="logout()" class="btn-logout">Cerrar Sesión</button>
          </nav>
        </div>
      </header>
      <main class="app-content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .app-header {
      background: white;
      border-bottom: 1px solid var(--border-color);
      height: 60px;
      display: flex;
      align-items: center;
      position: sticky;
      top: 0;
      z-index: 100;
      box-shadow: 0 1px 2px rgba(0,0,0,0.03);
    }

    .header-container {
      width: 100%;
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 700;
      font-size: 1.1rem;
      color: var(--text-main);
    }

    .logo-icon {
      background: var(--primary-color);
      color: white;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 0.9rem;
    }

    .nav-link {
      color: var(--text-secondary);
      text-decoration: none;
      margin-right: 24px;
      font-weight: 500;
      font-size: 0.95rem;
      transition: color 0.2s;
    }

    .nav-link:hover, .nav-link.active {
      color: var(--primary-color);
    }

    .btn-logout {
      background: transparent;
      border: 1px solid var(--border-color);
      color: var(--text-secondary);
      padding: 6px 12px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.9rem;
      transition: all 0.2s;
    }

    .btn-logout:hover {
      background: #f1f5f9;
      color: var(--text-main);
      border-color: #cbd5e1;
    }

    .app-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 30px 20px;
    }
  `]
})
export class LayoutComponent {
  constructor(private authService: AuthService, private router: Router) { }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
