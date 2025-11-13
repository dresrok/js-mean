import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { Router, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';

import { ApiService } from '../../../core/api.service';
import { Incident } from '../incident.model';

// Componente que muestra el listado completo de incidentes en una tabla.
@Component({
  selector: 'app-incident-list',
  standalone: true,
  imports: [
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    RouterLink,
    AsyncPipe,
    DatePipe
  ],
  templateUrl: './incident-list.html',
  styleUrl: './incident-list.scss'
})
export class IncidentList implements OnInit {
  private readonly api = inject(ApiService);
  private readonly router = inject(Router);

  incidents$!: Observable<Incident[]>;
  // Define las columnas visibles en la tabla de incidentes.
  readonly displayedColumns = [
    'reference',
    'title',
    'status',
    'severity',
    'assignedTo',
    'reportedBy',
    'updatedAt'
  ];

  // Carga los incidentes desde el backend al inicializar el componente.
  ngOnInit(): void {
    this.incidents$ = this.api.getIncidents();
  }

  // Navega a la pantalla de creación de un nuevo incidente.
  create(): void {
    this.router.navigate(['/incidentes/nuevo']);
  }
}
