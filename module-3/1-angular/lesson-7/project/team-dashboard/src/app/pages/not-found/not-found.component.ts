import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink],
  template: `
    <div class="not-found">
      <h1>{{ title }}</h1>
      <p>{{ message }}</p>
      <a routerLink="/dashboard" class="home-link">
        ← Volver al Dashboard
      </a>
    </div>
  `,
  styles: `
  .not-found {
      text-align: center;
      padding: 60px 20px;
    }

    .not-found h1 {
      font-size: 48px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: 20px;
    }

    .not-found p {
      font-size: 18px;
      color: #666;
      margin-bottom: 30px;
    }

    .home-link {
      display: inline-block;
      padding: 12px 24px;
      background: #667eea;
      color: white;
      text-decoration: none;
      border-radius: 6px;
    }

    .home-link:hover {
      background: #5a6fd8;
    }
  `,
})
export class NotFoundComponent {
  title: string = ''
  message: string = '';

  constructor(private router: Router) {
    // Leer state de la navegación (más limpio que query params)
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras?.state || history.state;

    this.title = state?.['title'] || '404 - Página no encontrada'
    this.message = state?.['message'] || 'La página que buscas no existe.';
  }
}
