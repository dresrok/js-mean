import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { firstValueFrom } from 'rxjs';

import { ApiService } from '../../../core/api.service';
import { NotificationsService } from '../../../core/notifications.service';
import { IncidentForm } from '../incident-form/incident-form';
import {
  Incident,
  IncidentCreateRequest,
  IncidentStatus,
} from '../incident.model';
import { User } from '../../users/user.model';

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
  private readonly notifications = inject(NotificationsService);

  readonly loading = signal(true);
  readonly incident = signal<Incident | null>(null);
  readonly reporters = signal<User[]>([]);
  readonly agents = signal<User[]>([]);

  readonly incidentId = this.route.snapshot.paramMap.get('id');
  readonly isCreateMode = !this.incidentId || this.incidentId === 'nuevo';

  async ngOnInit(): Promise<void> {
    await this.loadReporters();
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

  private async loadReporters(): Promise<void> {
    try {
      const users = await firstValueFrom(this.api.getUsers({ role: 'reporter' }));
      this.reporters.set(users);
    } catch {
      this.notifications.error('No pudimos cargar los reporteros disponibles');
    }
  }

  private async loadAgents(): Promise<void> {
    try {
      const users = await firstValueFrom(this.api.getUsers({ role: 'agent' }));
      this.agents.set(users);
    } catch {
      this.notifications.error('No pudimos cargar los agentes disponibles');
    }
  }

  cancel(): void {
    this.router.navigate(['/incidentes']);
  }

  async handleSubmit(formValue: IncidentCreateRequest): Promise<void> {
    try {
      if (this.isCreateMode) {
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
