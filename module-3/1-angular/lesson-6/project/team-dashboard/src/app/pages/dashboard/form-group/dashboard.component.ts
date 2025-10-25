import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
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
export class DashboardFormGroupComponent implements OnInit {
  teamMembers: TeamMember[] = [];
  filteredMembers: TeamMember[] = [];

  // Paso 2: FormGroup para múltiples controles
  filterForm = new FormGroup({
    searchTerm: new FormControl(''),
    department: new FormControl('todos'),
    availability: new FormControl('todos')
  });

  constructor(
    private teamMemberService: TeamMemberService,
    private favoriteService: FavoriteService
  ) { }

  ngOnInit() {
    this.teamMembers = this.teamMemberService.getTeamMembers();
    this.filteredMembers = this.teamMembers;

    // Escuchar cambios en cualquier filtro
    this.filterForm.valueChanges.subscribe(filters => {
      this.applyAdvancedFilters(filters);
    });
  }

  private applyAdvancedFilters(filters: any): void {
    let filtered = this.teamMembers;

    // Filtro por búsqueda usando el servicio
    if (filters.searchTerm) {
      filtered = this.teamMemberService.searchMembers(filters.searchTerm);
    }

    // Filtro por departamento
    if (filters.department !== 'todos') {
      filtered = filtered.filter(member => member.department === filters.department);
    }

    // Filtro por disponibilidad
    if (filters.availability !== 'todos') {
      filtered = filtered.filter(member => member.availability === filters.availability);
    }

    this.filteredMembers = filtered;
  }

  onClickFavorite(data: { member: TeamMember }) {
    this.favoriteService.toggleFavorite(data.member.id);
  }

  isMemberFavorite(memberId: number) {
    return this.favoriteService.isFavorite(memberId)
  }
}
