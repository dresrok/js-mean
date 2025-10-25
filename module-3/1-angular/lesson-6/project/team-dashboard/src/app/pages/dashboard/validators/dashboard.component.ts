import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TeamMember } from '../../../models/team-member.interface';
import { TeamMemberService } from '../../../services/team-member.service';
import { FavoriteService } from '../../../services/favorite.service';
import { TeamMemberCardComponent } from '../../../components/team-member-card/team-member-card.component';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, ReactiveFormsModule, RouterLink, TeamMemberCardComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardValidatorsComponent implements OnInit {
  teamMembers: TeamMember[] = [];
  filteredMembers: TeamMember[] = [];

  // Paso 3: FormGroup con validadores built-in
  filterForm = new FormGroup({
    searchTerm: new FormControl('', [Validators.minLength(2)]),
    department: new FormControl('todos', [Validators.required]),
    availability: new FormControl('todos', [Validators.required])
  });

  constructor(
    private teamMemberService: TeamMemberService,
    private favoriteService: FavoriteService
  ) { }

  ngOnInit() {
    this.teamMembers = this.teamMemberService.getTeamMembers();
    this.filteredMembers = this.teamMembers;

    // Solo aplicar filtros si el formulario es válido
    this.filterForm.valueChanges.subscribe(filters => {
      if (this.filterForm.valid) {
        this.applyAdvancedFilters(filters);
      }
    });
  }

  private applyAdvancedFilters(filters: any): void {
    let filtered = this.teamMembers;

    // Validar longitud mínima en búsqueda usando el servicio
    if (filters.searchTerm && filters.searchTerm.length >= 2) {
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

  // Helper methods para validación
  isFieldInvalid(fieldName: string): boolean {
    const field = this.filterForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  getFieldError(fieldName: string): string {
    const field = this.filterForm.get(fieldName);
    if (field?.errors?.['minlength']) {
      return `Mínimo ${field.errors['minlength'].requiredLength} caracteres`;
    }
    return '';
  }

  onClickFavorite(data: { member: TeamMember }) {
    this.favoriteService.toggleFavorite(data.member.id);
  }

  isMemberFavorite(memberId: number) {
    return this.favoriteService.isFavorite(memberId)
  }
}
