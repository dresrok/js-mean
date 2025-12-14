import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-wrapper">
      <div class="login-card card">
        <div class="login-header">
          <h2>Bienvenido</h2>
          <p>Ingresa tus credenciales para continuar</p>
        </div>

        <form (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="email">Correo Electrónico</label>
            <input type="email" id="email" [(ngModel)]="email" name="email" placeholder="ejemplo@correo.com" required>
          </div>
          <div class="form-group">
            <label for="password">Contraseña</label>
            <input type="password" id="password" [(ngModel)]="password" name="password" placeholder="••••••••" required>
          </div>
          <button type="submit" class="btn-primary">Iniciar Sesión</button>
        </form>

        <p *ngIf="error" class="error-msg">{{ error }}</p>
      </div>
    </div>
  `,
  styles: [`
    .login-wrapper {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #f6f8fa;
    }

    .login-card {
      width: 100%;
      max-width: 400px;
      margin: 20px;
      background: white;
      /* Inherits .card style from global but can override here */
    }

    .login-header {
      text-align: center;
      margin-bottom: 24px;
    }

    .login-header h2 {
      margin-bottom: 8px;
      font-size: 1.5rem;
    }

    .login-header p {
      color: var(--text-secondary);
      font-size: 0.9rem;
    }

    .error-msg {
      margin-top: 16px;
      padding: 10px;
      background-color: #fde8e8;
      color: #c53030;
      border-radius: 4px;
      font-size: 0.9rem;
      text-align: center;
    }
  `]
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';

  constructor(private authService: AuthService, private router: Router) { }

  onSubmit() {
    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: () => {
        this.router.navigate(['/metas']);
      },
      error: (err) => {
        this.error = 'Credenciales inválidas. Intente nuevamente.';
        console.error(err);
      }
    });
  }
}
