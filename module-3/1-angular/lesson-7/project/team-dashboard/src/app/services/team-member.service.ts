import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TeamMember } from '../models/team-member.interface';
import { environment } from '../../environments/environment';
import { LoggerService } from './logger.service';

/**
 * TeamMemberService - Gestiona las operaciones CRUD de miembros del equipo
 *
 * VERSIÓN CON HTTP: Este servicio ahora se comunica con un backend REST API
 * usando HttpClient para realizar operaciones asíncronas.
 */
@Injectable({
  providedIn: 'root'
})
export class TeamMemberService {
  private apiUrl = `${environment.apiUrl}/team-members`;

  constructor(
    private http: HttpClient,
    private logger: LoggerService
  ) {
    this.logger.logTeamMemberAction('Servicio Team Member Inicializado con HttpClient', { apiUrl: this.apiUrl });
  }

  /**
   * GET: Obtener todos los miembros del equipo
   * @returns Observable<TeamMember[]> - Stream de datos de miembros
   */
  getTeamMembers(): Observable<TeamMember[]> {
    this.logger.logTeamMemberAction('GET: Obteniendo todos los miembros del equipo');
    return this.http.get<TeamMember[]>(this.apiUrl);
  }

  /**
   * GET: Obtener un miembro por ID
   * @param id - ID del miembro a buscar (hex string generado por JSON Server v1.x)
   * @returns Observable<TeamMember> - Stream del miembro encontrado
   */
  getMemberById(id: string): Observable<TeamMember> {
    this.logger.logTeamMemberAction('GET: Obteniendo miembro por ID', { id });
    return this.http.get<TeamMember>(`${this.apiUrl}/${id}`);
  }

  /**
   * GET: Búsqueda de miembros por nombre
   * Utiliza query params de JSON Server para filtrado en el servidor
   * @param searchTerm - Término de búsqueda
   * @returns Observable<TeamMember[]> - Stream de miembros filtrados
   */
  searchMembers(searchTerm: string): Observable<TeamMember[]> {
    this.logger.logTeamMemberAction('GET: Buscando miembros', { searchTerm });

    if (!searchTerm.trim()) {
      return this.getTeamMembers();
    }

    // JSON Server soporta búsqueda con 'name_like' para filtrado parcial
    const params = new HttpParams().set('name_like', searchTerm);
    return this.http.get<TeamMember[]>(this.apiUrl, { params });
  }

  /**
   * POST: Crear nuevo miembro del equipo
   * @param member - Datos del miembro sin ID (el servidor genera el ID)
   * @returns Observable<TeamMember> - Stream del miembro creado con ID asignado
   */
  createMember(member: Omit<TeamMember, 'id'>): Observable<TeamMember> {
    this.logger.logTeamMemberAction('POST: Creando nuevo miembro', { member });
    return this.http.post<TeamMember>(this.apiUrl, member);
  }

  /**
   * PUT: Actualizar miembro existente (reemplaza el recurso completo)
   * @param id - ID del miembro a actualizar (hex string)
   * @param member - Datos completos del miembro
   * @returns Observable<TeamMember> - Stream del miembro actualizado
   */
  updateMember(id: string, member: TeamMember): Observable<TeamMember> {
    this.logger.logTeamMemberAction('PUT: Actualizando miembro', { id, member });
    return this.http.put<TeamMember>(`${this.apiUrl}/${id}`, member);
  }

  /**
   * PATCH: Actualización parcial de miembro (solo campos modificados)
   * @param id - ID del miembro a actualizar (hex string)
   * @param changes - Campos a modificar (parcial)
   * @returns Observable<TeamMember> - Stream del miembro actualizado
   */
  patchMember(id: string, changes: Partial<TeamMember>): Observable<TeamMember> {
    this.logger.logTeamMemberAction('PATCH: Actualizando parcialmente miembro', { id, changes });
    return this.http.patch<TeamMember>(`${this.apiUrl}/${id}`, changes);
  }

  /**
   * DELETE: Eliminar miembro del equipo
   * @param id - ID del miembro a eliminar (hex string)
   * @returns Observable<void> - Stream vacío cuando se completa la eliminación
   */
  deleteMember(id: string): Observable<void> {
    this.logger.logTeamMemberAction('DELETE: Eliminando miembro', { id });
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
