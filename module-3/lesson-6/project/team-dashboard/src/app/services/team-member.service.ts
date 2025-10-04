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

  addMember(memberData: Omit<TeamMember, 'id'>): TeamMember {
    const newId = Math.max(...this.teamMembers.map(m => m.id)) + 1;
    const newMember: TeamMember = {
      ...memberData,
      id: newId,
      joinDate: new Date(memberData.joinDate)
    };

    this.teamMembers.push(newMember);
    this.logger.logTeamMemberAction('Miembro agregado', { name: newMember.name, id: newId });

    return newMember;
  }

  updateMember(id: number, memberData: Partial<TeamMember>): TeamMember | null {
    const index = this.teamMembers.findIndex(m => m.id === id);

    if (index === -1) {
      this.logger.logTeamMemberAction('Miembro no encontrado para actualizar', { id });
      return null;
    }

    this.teamMembers[index] = {
      ...this.teamMembers[index],
      ...memberData,
      id, // Ensure ID doesn't change
      joinDate: memberData.joinDate ? new Date(memberData.joinDate) : this.teamMembers[index].joinDate
    };

    this.logger.logTeamMemberAction('Miembro actualizado', { name: this.teamMembers[index].name, id });

    return this.teamMembers[index];
  }
}
