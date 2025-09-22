import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from './components/header/header.component';
import { TeamMemberCardComponent } from './components/team-member-card/team-member-card.component';
import { TeamMember } from './models/team-member.interface';

import { TeamMemberService } from './services/team-member.service';
import { FavoriteService } from './services/favorite.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule, HeaderComponent, TeamMemberCardComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  companyName = 'InnovateTech';
  currentUser = 'María González';

  teamMembers: TeamMember[] = [];
  filteredMembers: TeamMember[] = [];
  searchTerm: string = '';

  currentFilter: 'todos' | 'disponible' | 'ingenieria' = 'todos';

  constructor(
    private teamMemberService: TeamMemberService,
    private favoriteService: FavoriteService
  ) { }

  ngOnInit(): void {
    this.teamMembers = this.teamMemberService.getTeamMembers();
    this.applyFilters();
  }

  setFilter(filter: 'todos' | 'disponible' | 'ingenieria') {
    this.currentFilter = filter;
    this.applyFilters();
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  private applyFilters(): void {
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

    // Apply search filter using service
    if (this.searchTerm.trim()) {
      filtered = this.teamMemberService.searchMembers(this.searchTerm);
      // Apply category filter again if needed
      if (this.currentFilter !== 'todos') {
        switch (this.currentFilter) {
          case 'disponible':
            filtered = filtered.filter(m => m.availability === 'disponible');
            break;
          case 'ingenieria':
            filtered = filtered.filter(m => m.department === 'Ingeniería');
            break;
        }
      }
    }

    this.filteredMembers = filtered;
  }

  get totalCount(): number {
    return this.filteredMembers.length;
  }

  get availableCount(): number {
    return this.filteredMembers.filter(m => m.availability === 'disponible').length;
  }

  get engineeringCount(): number {
    return this.filteredMembers.filter(m => m.department === 'Ingeniería').length;
  }

  // Handle member interactions from child components
  onFavoriteInteraction(event: { member: TeamMember }) {
    const isFavorite = this.favoriteService.toggleFavorite(event.member.id);
  }

  isMemberFavorite(memberId: number): boolean {
    return this.favoriteService.isFavorite(memberId);
  }
}
