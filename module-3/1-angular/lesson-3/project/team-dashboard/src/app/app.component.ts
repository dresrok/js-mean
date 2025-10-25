import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from './components/header/header.component';
import { TeamMemberCardComponent } from './components/team-member-card/team-member-card.component';
import { TeamMember } from './models/team-member.interface';
import { TEAM_MEMBERS_DATA } from './data/team-members.data';

@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule, HeaderComponent, TeamMemberCardComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  companyName = 'InnovateTech';
  currentUser = 'María González';

  teamMembers: TeamMember[] = TEAM_MEMBERS_DATA;
  searchTerm: string = '';

  currentFilter: 'todos' | 'disponible' | 'ingenieria' = 'todos';

  setFilter(filter: 'todos' | 'disponible' | 'ingenieria') {
    this.currentFilter = filter;
  }

  get filteredMembers(): TeamMember[] {
    let filtered = this.teamMembers;

    // Apply category filter
    switch (this.currentFilter) {
      case 'disponible':
        filtered = filtered.filter(m => m.availability === 'disponible');
        break;
      case 'ingenieria':
        filtered = filtered.filter(m => m.department === 'Ingeniería');
        break;
    }

    // Apply search filter
    if (this.searchTerm.trim()) {
      filtered = filtered.filter(m =>
        m.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    return filtered;
  }

  get availableCount(): number {
    return this.teamMembers.filter(m => m.availability === 'disponible').length;
  }

  get engineeringCount(): number {
    return this.teamMembers.filter(m => m.department === 'Ingeniería').length;
  }

  // @Output example - Handle member interactions from child components
  onMemberInteraction(event: { member: TeamMember }) {
    console.log('🔄 Interacción recibida del componente hijo:', event);

    const { member } = event
    const { id, name } = member
    window.alert(`⭐ ${name}`);
    console.log({ id, name });
  }

}
