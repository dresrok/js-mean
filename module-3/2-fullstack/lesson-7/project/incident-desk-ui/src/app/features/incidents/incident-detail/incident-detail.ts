import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { firstValueFrom } from 'rxjs';

import { ApiService } from '../../../core/api.service';
import { AuthService } from '../../../core/auth.service';
import { NotificationsService } from '../../../core/notifications.service';
import { PERMISSIONS } from '../../../core/permissions';
import { IncidentForm } from '../incident-form/incident-form';
import {
  Incident,
  IncidentCreateRequest,
  IncidentStatus,
} from '../incident.model';
import { User } from '../../users/user.model';

// Componente para crear o editar un incidente con formulario reactivo.
@Component({
  selector: 'app-incident-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, MatProgressSpinnerModule, MatButtonModule, IncidentForm],
  templateUrl: './incident-detail.html',
  styleUrl: './incident-detail.scss',
})
export class IncidentDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly api = inject(ApiService);
  private readonly auth = inject(AuthService);
  private readonly notifications = inject(NotificationsService);

  readonly loading = signal(true);
  readonly incident = signal<Incident | null>(null);
  readonly agents = signal<User[]>([]);

  readonly incidentId = this.route.snapshot.paramMap.get('id');
  // Determina si estamos en modo creación o edición según la URL.
  readonly isCreateMode = !this.incidentId || this.incidentId === 'nuevo';

  // Carga los datos necesarios para el formulario al inicializar.
  async ngOnInit(): Promise<void> {
    await this.loadAgents();

    if (this.isCreateMode) {
      this.loading.set(false);
      return;
    }

    const id = this.incidentId!;

    try {
      const data = await firstValueFrom(this.api.getIncident(id));
      this.incident.set(data);
    } catch (error) {
      this.notifications.error('No encontramos el incidente solicitado');
      await this.router.navigate(['/incidentes']);
    } finally {
      this.loading.set(false);
    }
  }

  // Carga la lista de usuarios con rol agent para el selector del formulario.
  private async loadAgents(): Promise<void> {
    try {
      const users = await firstValueFrom(this.api.getUsers({ role: 'agent' }));
      this.agents.set(users);
    } catch {
      this.notifications.error('No pudimos cargar los agentes disponibles');
    }
  }

  /**
   * Verifica si el usuario actual puede cancelar incidentes.
   * - Solo admins tienen este permiso
   */
  canCancelIncident(): boolean {
    return this.auth.checkPermission(PERMISSIONS.INCIDENTS_CANCEL);
  }

  // Cancela la operación y regresa al listado de incidentes.
  cancel(): void {
    this.router.navigate(['/incidentes']);
  }

  // Procesa el envío del formulario, creando o actualizando según el modo.
  async handleSubmit(formValue: IncidentCreateRequest): Promise<void> {
    try {
      if (this.isCreateMode) {
        formValue.reportedBy = this.auth.getCurrentUser()?._id ?? '';
        const created = await firstValueFrom(this.api.createIncident(formValue));
        this.notifications.success(`Incidente ${created.reference} creado correctamente`);
      } else if (this.incidentId) {
        const updated = await firstValueFrom(this.api.updateIncident(this.incidentId, formValue));
        this.notifications.success(`Incidente ${updated.reference} actualizado`);
      }
      await this.router.navigate(['/incidentes']);
    } catch {
      this.notifications.error('Ocurrió un error al guardar el incidente');
    }
  }

  // Marca un incidente como cancelado después de confirmar con el usuario.
  async markAsCancelled(): Promise<void> {
    if (this.isCreateMode || !this.incidentId) {
      return;
    }

    if (!confirm('¿Cancelar este incidente?')) {
      return;
    }

    try {
      const updated = await firstValueFrom(
        this.api.cancelIncident(this.incidentId, 'cancelled' as IncidentStatus),
      );
      this.incident.set(updated);
      this.notifications.success(`Incidente ${updated.reference} cancelado`);
    } catch {
      this.notifications.error('No se pudo cancelar el incidente');
    }
  }
}
