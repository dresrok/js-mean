import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';

import { AuthService } from '../../../core/auth.service';
import { NotificationsService } from '../../../core/notifications.service';

// Pantalla de login standalone que centraliza validaciones básicas y navegación post autenticación.
@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule],
  templateUrl: './login-form.html',
  styleUrl: './login-form.scss',
})
export class LoginForm {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly notifications = inject(NotificationsService);
  private readonly router = inject(Router);

  isSubmitting = false;

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  // Maneja el submit del formulario evitando envíos duplicados.
  async submit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;

    try {
      await this.auth.login(this.form.getRawValue());
      this.notifications.success('Sesión iniciada correctamente');
      await this.router.navigate(['/incidentes']);
    } catch {
      this.notifications.error('Revisa tus credenciales e inténtalo de nuevo');
    } finally {
      this.isSubmitting = false;
    }
  }
}
