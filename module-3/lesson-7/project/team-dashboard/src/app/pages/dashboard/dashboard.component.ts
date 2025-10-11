import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TeamMember } from '../../models/team-member.interface';
import { TeamMemberService } from '../../services/team-member.service';
import { FavoriteService } from '../../services/favorite.service';
import { TeamMemberCardComponent } from '../../components/team-member-card/team-member-card.component';
import { LoadingComponent } from '../../components/loading/loading.component';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, ReactiveFormsModule, RouterLink, TeamMemberCardComponent, LoadingComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit, OnDestroy {
  teamMembers: TeamMember[] = [];
  filteredMembers: TeamMember[] = [];

  // Estados de carga y error
  isLoading = false;
  error: string | null = null;

  // Subject usado como "señal de destrucción" para cancelar todas las suscripciones
  private destroy$ = new Subject<void>();

  // FormGroup con validadores built-in
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
    this.loadTeamMembers();

    // Solo aplicar filtros si el formulario es válido
    this.filterForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(filters => {
        if (this.filterForm.valid) {
          this.applyAdvancedFilters(filters);
        }
      });
  }

  loadTeamMembers(): void {
    this.isLoading = true;
    this.error = null;

    this.teamMemberService.getTeamMembers()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (members) => {
          this.teamMembers = members;
          this.filteredMembers = members;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error al cargar miembros:', error);
          this.error = 'Error al cargar los miembros del equipo. Por favor, intenta de nuevo.';
          this.isLoading = false;
        }
      });
  }

  private applyAdvancedFilters(filters: any): void {
    let filtered = this.teamMembers;

    // Filtro por búsqueda de nombre (aplicado en el cliente)
    // Nota: En una implementación real, podrías hacer la búsqueda en el servidor
    // usando el método searchMembers() del servicio para mejor rendimiento
    if (filters.searchTerm && filters.searchTerm.length >= 2) {
      const term = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(member =>
        member.name.toLowerCase().includes(term)
      );
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

  isMemberFavorite(memberId: string) {
    return this.favoriteService.isFavorite(memberId)
  }

  ngOnDestroy(): void {
    // Emitir señal para cancelar todas las suscripciones que usan takeUntil(this.destroy$)
    this.destroy$.next();
    this.destroy$.complete();
  }
}
