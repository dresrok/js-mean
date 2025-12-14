import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import type { Incident, IncidentCreateRequest } from '../incident.model';
import type { User } from '../../users/user.model';

// Formulario reactivo reutilizable para crear o editar incidentes.
@Component({
  selector: 'app-incident-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatChipsModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './incident-form.html',
  styleUrl: './incident-form.scss',
})
export class IncidentForm implements OnChanges {
  private readonly fb = inject(FormBuilder);

  @Input() incident: Incident | null = null;
  @Input() loading = false;
  @Input() agents: User[] = [];
  @Output() readonly submitted = new EventEmitter<IncidentCreateRequest>();
  @Output() readonly cancelled = new EventEmitter<void>();

  // Define el formulario reactivo con validaciones básicas.
  readonly form = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(8)]],
    description: ['', Validators.required],
    severity: ['medium', Validators.required],
    status: ['new', Validators.required],
    assignedTo: [undefined as string | undefined],
  });

  // Actualiza el formulario cuando cambian los datos de entrada.
  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['incident']) {
      return;
    }

    if (this.incident) {
      this.form.patchValue({
        title: this.incident.title,
        description: this.incident.description,
        severity: this.incident.severity,
        status: this.incident.status,
        assignedTo: this.incident.assignedTo?._id ?? undefined,
      });
    } else {
      this.form.reset({
        title: '',
        description: '',
        severity: 'medium',
        status: 'new',
        assignedTo: undefined,
      });
    }
  }

  // Emite el evento de cancelación al componente padre.
  cancel(): void {
    this.cancelled.emit();
  }

  // Valida y emite los datos del formulario si son válidos.
  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitted.emit(this.form.getRawValue() as IncidentCreateRequest);
  }
}
