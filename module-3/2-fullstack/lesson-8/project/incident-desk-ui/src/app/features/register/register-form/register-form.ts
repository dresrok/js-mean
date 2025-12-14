import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterModule } from '@angular/router';

import { AuthService } from '../../../core/auth.service';
import { NotificationsService } from '../../../core/notifications.service';

function matchControlsValidator(sourceKey: string, targetKey: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const source = control.get(sourceKey)?.value;
    const target = control.get(targetKey)?.value;
    if (!source || !target) {
      return null;
    }
    return source === target ? null : { mismatch: true };
  };
}

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './register-form.html',
  styleUrl: './register-form.scss',
})
export class RegisterForm {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly notifications = inject(NotificationsService);
  private readonly router = inject(Router);

  isSubmitting = false;

  readonly form = this.fb.nonNullable.group(
    {
      fullName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(120)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(72)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(72)]],
    },
    { validators: [matchControlsValidator('password', 'confirmPassword')] }
  );

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
      const raw = this.form.getRawValue();
      await this.auth.register({
        fullName: raw.fullName,
        email: raw.email,
        password: raw.password,
      });
      this.notifications.success('Cuenta creada correctamente');
      await this.router.navigate(['/incidentes']);
    } catch (error) {
      if (error instanceof HttpErrorResponse && error.status === 409) {
        this.notifications.error('Este correo ya está registrado');
      } else {
        this.notifications.error('No se pudo crear la cuenta, intenta de nuevo');
      }
    } finally {
      this.isSubmitting = false;
    }
  }
}


