import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, OnInit, inject, computed } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { ApiService } from '../../../core/api.service';
import { AuthService } from '../../../core/auth.service';
import { PERMISSIONS } from '../../../core/permissions';
import { Incident } from '../incident.model';

/**
 * Componente que muestra el listado de incidentes en una tabla.
 * Ajusta las columnas y acciones visibles según los permisos del usuario.
 */
@Component({
  selector: 'app-incident-list',
  standalone: true,
  imports: [
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    AsyncPipe,
    DatePipe,
  ],
  templateUrl: './incident-list.html',
  styleUrl: './incident-list.scss',
})
export class IncidentList implements OnInit {
  private readonly api = inject(ApiService);
  private readonly router = inject(Router);
  private readonly auth = inject(AuthService);

  incidents$!: Observable<Incident[]>;

  // Columnas base que siempre se muestran
  private readonly baseColumns = [
    'reference',
    'title',
    'status',
    'severity',
    'updatedAt',
  ];

  // Computed signal que ajusta las columnas según los permisos
  readonly displayedColumns = computed(() => {
    const columns = [...this.baseColumns];

    // Los reporters solo ven sus propios incidentes, no necesitan ver quién reportó
    // Agents y admins ven todos los incidentes, así que necesitan estas columnas
    if (this.auth.checkPermission(PERMISSIONS.INCIDENTS_READ_ALL)) {
      columns.splice(4, 0, 'assignedTo', 'reportedBy');
    }

    // Agregar columna de acciones solo si el usuario puede hacer algo con los incidentes
    const canUpdate =
      this.auth.checkPermission(PERMISSIONS.INCIDENTS_UPDATE_ALL) ||
      this.auth.checkPermission(PERMISSIONS.INCIDENTS_UPDATE_ASSIGNED);

    if (canUpdate) {
      columns.push('actions');
    }

    return columns;
  });

  // Carga los incidentes desde el backend al inicializar el componente.
  ngOnInit(): void {
    this.incidents$ = this.api.getIncidents();
  }

  /**
   * Verifica si el usuario actual puede crear incidentes.
   * - Reporters y Admins pueden crear
   * - Agents no pueden crear
   */
  canCreateIncident(): boolean {
    return this.auth.checkPermission(PERMISSIONS.INCIDENTS_CREATE);
  }

  // Navega a la pantalla de creación de un nuevo incidente.
  create(): void {
    this.router.navigate(['/incidentes/nuevo']);
  }

  /**
   * Verifica si el usuario actual puede editar un incidente específico.
   * - Admins pueden editar cualquier incidente
   * - Agents solo pueden editar incidentes asignados a ellos
   * - Reporters no pueden editar incidentes
   */
  canEditIncident(incident: Incident): boolean {
    // Si tiene permiso para actualizar cualquier incidente, puede editar
    if (this.auth.checkPermission(PERMISSIONS.INCIDENTS_UPDATE_ALL)) {
      return true;
    }

    // Si tiene permiso para actualizar solo asignados, verificar asignación
    if (this.auth.checkPermission(PERMISSIONS.INCIDENTS_UPDATE_ASSIGNED)) {
      const currentUser = this.auth.getCurrentUser();
      return incident.assignedTo?._id === currentUser?._id;
    }

    return false;
  }

  // Navega a la pantalla de edición de un incidente.
  editIncident(incident: Incident): void {
    this.router.navigate(['/incidentes', incident._id, 'editar']);
  }
}
