import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
  Incident,
  IncidentCreateRequest,
  IncidentStatus,
  IncidentUpdateRequest,
} from '../features/incidents/incident.model';
import { User } from '../features/users/user.model';

export const API_URL = 'http://localhost:8080/api';

// Servicio centralizado para todas las llamadas HTTP al backend.
@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = API_URL;

  // Obtiene la lista completa de incidentes.
  getIncidents(): Observable<Incident[]> {
    return this.http.get<Incident[]>(`${this.apiUrl}/incidents`);
  }

  // Obtiene un incidente específico por su ID.
  getIncident(id: string): Observable<Incident> {
    return this.http.get<Incident>(`${this.apiUrl}/incidents/${id}`);
  }

  // Crea un nuevo incidente con los datos proporcionados.
  createIncident(payload: IncidentCreateRequest): Observable<Incident> {
    return this.http.post<Incident>(`${this.apiUrl}/incidents`, payload);
  }

  // Actualiza un incidente existente.
  updateIncident(id: string, payload: IncidentUpdateRequest): Observable<Incident> {
    return this.http.put<Incident>(`${this.apiUrl}/incidents/${id}`, payload);
  }

  // Cambia el estado de un incidente (útil para cancelar o cambiar estados).
  cancelIncident(id: string, status: IncidentStatus): Observable<Incident> {
    return this.http.patch<Incident>(`${this.apiUrl}/incidents/${id}`, { status });
  }

  // Obtiene la lista de usuarios con filtrado opcional por rol.
  getUsers(options?: { role?: User['role'] }): Observable<User[]> {
    const params = options?.role ? new HttpParams().set('role', options.role) : undefined;
    return this.http.get<User[]>(`${this.apiUrl}/users`, { params });
  }
}
