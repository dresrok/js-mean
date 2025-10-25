import { Component, OnInit } from '@angular/core';
import { TeamMember } from '../../models/team-member.interface';
import { TeamMemberService } from '../../services/team-member.service';
import { FavoriteService } from '../../services/favorite.service';
import { TeamMemberCardComponent } from '../../components/team-member-card/team-member-card.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, FormsModule, TeamMemberCardComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  teamMembers: TeamMember[] = [];
  filteredMembers: TeamMember[] = [];
  searchTerm: string = '';

  currentFilter: 'todos' | 'disponible' | 'ingenieria' = 'todos'

  constructor(
    private teamMemberService: TeamMemberService,
    private favoriteService: FavoriteService
  ) { }

  ngOnInit() {
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

    switch (this.currentFilter) {
      case 'disponible':
        filtered = filtered.filter(m => m.availability === 'disponible');
        break;
      case 'ingenieria':
        filtered = filtered.filter(m => m.department === 'Ingeniería');
        break;
    }

    if (this.searchTerm.trim()) {
      filtered = this.teamMemberService.searchMembers(this.searchTerm);

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

  onClickFavorite(data: { member: TeamMember }) {
    this.favoriteService.toggleFavorite(data.member.id);
  }

  isMemberFavorite(memberId: number) {
    return this.favoriteService.isFavorite(memberId)
  }
}
