import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { TeamMember } from '../models/team-member.interface';
import { TeamMemberService } from '../services/team-member.service';

/**
 * Resolver para precargar la lista de miembros del equipo antes de activar la ruta
 *
 * Ventajas:
 * - Los datos están disponibles cuando el componente se inicializa
 * - Mejor UX: no se ve el componente vacío mientras carga
 * - Componente más simple: no necesita manejar estados de loading
 */
export const teamMembersResolver: ResolveFn<TeamMember[]> = () => {
  return inject(TeamMemberService).getTeamMembers();
};
