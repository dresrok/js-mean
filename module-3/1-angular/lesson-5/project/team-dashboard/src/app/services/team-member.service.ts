import { Injectable } from '@angular/core';
import { TeamMember } from '../models/team-member.interface';
import { TEAM_MEMBERS_DATA } from '../data/team-members.data';
import { LoggerService } from './logger.service';

@Injectable({
  providedIn: 'root'
})
export class TeamMemberService {
  private teamMembers: TeamMember[] = TEAM_MEMBERS_DATA;

  constructor(private logger: LoggerService) {
    this.logger.logTeamMemberAction('Servicio Team Member Inicializado', { count: this.teamMembers.length })
  }

  getTeamMembers(): TeamMember[] {
    this.logger.logTeamMemberAction('Obteniendo miembros de equipo');
    return this.teamMembers;
  }

  searchMembers(searchTerm: string = ''): TeamMember[] {
    this.logger.logTeamMemberAction('Buscando miembros de equipo', { searchTerm })

    if (!searchTerm.trim()) {
      return this.teamMembers;
    }

    const term = searchTerm.toLowerCase().trim();

    const filteredMembers = this.teamMembers.filter(member => {
      return member.name.toLowerCase().includes(term);
    });

    this.logger.logTeamMemberAction('Búsqueda completada', { searchTerm, totalResults: filteredMembers.length })

    return filteredMembers;
  }

  getMemberById(id: number): TeamMember | undefined | void {
    return this.teamMembers.find(member => member.id === id);
  }
}
