import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { TeamMemberCardComponent } from './components/team-member-card/team-member-card.component';
import { TeamMember } from './models/team-member.interface';
import { TEAM_MEMBERS_DATA } from './data/team-members.data';

@Component({
  selector: 'app-root',
  imports: [CommonModule, HeaderComponent, TeamMemberCardComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  companyName = 'InnovateTech';
  currentUser = 'María González';

  teamMembers: TeamMember[] = TEAM_MEMBERS_DATA;

  currentFilter: 'todos' | 'disponible' | 'ingenieria' = 'todos';

  setFilter(filter: 'todos' | 'disponible' | 'ingenieria') {
    this.currentFilter = filter;
  }

  getFilteredMembers(): TeamMember[] {
    switch (this.currentFilter) {
      case 'disponible':
        return this.teamMembers.filter(m => m.availability === 'disponible');
      case 'ingenieria':
        return this.teamMembers.filter(m => m.department === 'Ingeniería');
      default:
        return this.teamMembers;
    }
  }

  getAvailableCount(): number {
    return this.teamMembers.filter(m => m.availability === 'disponible').length;
  }

  getEngineeringCount(): number {
    return this.teamMembers.filter(m => m.department === 'Ingeniería').length;
  }

  onMemberInteraction(event: { memberId: number; memberName: string; action: string }) {
    console.log('🔄 Interacción recibida del componente hijo:', event);

    switch (event.action) {
      case 'favorite':
        this.toggleMemberFavorite(event.memberId, event.memberName);
        break;
    }
  }

  private toggleMemberFavorite(memberId: number, memberName: string) {
    window.alert(`⭐ ${memberName}`);
    console.log({ memberId, memberName });
  }
}
