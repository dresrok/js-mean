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

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/api';

  getIncidents(): Observable<Incident[]> {
    return this.http.get<Incident[]>(`${this.apiUrl}/incidents`);
  }

  getIncident(id: string): Observable<Incident> {
    return this.http.get<Incident>(`${this.apiUrl}/incidents/${id}`);
  }

  createIncident(payload: IncidentCreateRequest): Observable<Incident> {
    return this.http.post<Incident>(`${this.apiUrl}/incidents`, payload);
  }

  updateIncident(id: string, payload: IncidentUpdateRequest): Observable<Incident> {
    return this.http.put<Incident>(`${this.apiUrl}/incidents/${id}`, payload);
  }

  cancelIncident(id: string, status: IncidentStatus): Observable<Incident> {
    return this.http.patch<Incident>(`${this.apiUrl}/incidents/${id}`, { status });
  }

  getUsers(options?: { role?: User['role'] }): Observable<User[]> {
    const params = options?.role ? new HttpParams().set('role', options.role) : undefined;
    return this.http.get<User[]>(`${this.apiUrl}/users`, { params });
  }
}
