import { Injectable } from '@angular/core';
import { TeamMember } from '../models/team-member.interface';
import { TEAM_MEMBERS_DATA } from '../data/team-members.data';

@Injectable({
  providedIn: 'root'
})
export class TeamMemberService {
  private teamMembers: TeamMember[] = TEAM_MEMBERS_DATA;

  constructor() {}

  getTeamMembers(): TeamMember[] {
    return this.teamMembers;
  }

  searchMembers(searchTerm: string): TeamMember[] {
    if (!searchTerm.trim()) {
      return this.teamMembers;
    }

    const term = searchTerm.toLowerCase().trim();

    const filteredMembers = this.teamMembers.filter(member => {
      return member.name.toLowerCase().includes(term);
    });

    return filteredMembers;
  }
}
