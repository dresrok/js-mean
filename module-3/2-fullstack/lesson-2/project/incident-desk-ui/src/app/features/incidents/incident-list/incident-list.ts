import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { Router, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';

import { ApiService } from '../../../core/api.service';
import { Incident } from '../incident.model';

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
  readonly displayedColumns = [
    'reference',
    'title',
    'status',
    'severity',
    'assignedTo',
    'reportedBy',
    'updatedAt'
  ];

  ngOnInit(): void {
    this.incidents$ = this.api.getIncidents();
  }

  create(): void {
    this.router.navigate(['/incidentes/nuevo']);
  }
}
