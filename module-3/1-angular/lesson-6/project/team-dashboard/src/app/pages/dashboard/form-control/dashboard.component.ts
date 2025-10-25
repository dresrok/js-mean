import { Component, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TeamMember } from '../../../models/team-member.interface';
import { TeamMemberService } from '../../../services/team-member.service';
import { FavoriteService } from '../../../services/favorite.service';
import { TeamMemberCardComponent } from '../../../components/team-member-card/team-member-card.component';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, ReactiveFormsModule, TeamMemberCardComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardFormControlComponent implements OnInit {
  teamMembers: TeamMember[] = [];
  filteredMembers: TeamMember[] = [];

  // Paso 1: FormControl básico para búsqueda
  searchControl = new FormControl('');

  currentFilter: 'todos' | 'disponible' | 'ingenieria' = 'todos'

  constructor(
    private teamMemberService: TeamMemberService,
    private favoriteService: FavoriteService
  ) { }

  ngOnInit() {
    this.teamMembers = this.teamMemberService.getTeamMembers();
    this.applyFilters(''); // Mostrar todos los miembros inicialmente

    // Reactividad automática - sin necesidad de (input) events
    this.searchControl.valueChanges.subscribe(searchTerm => {
      this.applyFilters(searchTerm || '');
    });
  }

  setFilter(filter: 'todos' | 'disponible' | 'ingenieria') {
    this.currentFilter = filter;
    this.applyFilters(this.searchControl.value || '');
  }

  private applyFilters(searchTerm: string): void {
    let filtered = this.teamMembers;

    switch (this.currentFilter) {
      case 'disponible':
        filtered = filtered.filter(m => m.availability === 'disponible');
        break;
      case 'ingenieria':
        filtered = filtered.filter(m => m.department === 'Ingeniería');
        break;
    }

    if (searchTerm.trim()) {
      filtered = this.teamMemberService.searchMembers(searchTerm);

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
