import { Component, OnInit, OnDestroy, OnChanges, SimpleChanges, AfterViewInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, startWith } from 'rxjs/operators';
import { TeamMember } from '../../models/team-member.interface';
import { FavoriteService } from '../../services/favorite.service';
import { TeamMemberCardComponent } from '../../components/team-member-card/team-member-card.component';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, ReactiveFormsModule, RouterLink, TeamMemberCardComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnChanges, OnInit, AfterViewInit, OnDestroy {
  teamMembers: TeamMember[] = [];
  filteredMembers: TeamMember[] = [];

  // Subject usado como "señal de destrucción" para cancelar suscripciones de formularios reactivos
  private destroy$ = new Subject<void>();

  // FormGroup con validadores built-in
  filterForm = new FormGroup({
    searchTerm: new FormControl('', [Validators.minLength(2)]),
    department: new FormControl('todos', [Validators.required]),
    availability: new FormControl('todos', [Validators.required])
  });

  constructor(
    private route: ActivatedRoute,
    private favoriteService: FavoriteService
  ) {
    // before render
    // NO ASYNC
    console.log('constructor')
  }

  ngOnChanges(changes: SimpleChanges): void {
      // before render
      // during changes - listening changes on inputs @Input()
      console.log('ngOnChanges')
  }

  ngOnInit() {
    // after render
    // Async operations -> API calls, etc.
    // Initialization
    console.log('ngOnInit')
    // Obtener datos precargados del resolver
    this.teamMembers = this.route.snapshot.data['members'];
    this.filteredMembers = this.teamMembers; // Mostrar todos inicialmente

    // Configurar filtros reactivos
    // startWith emite el valor actual del formulario como primer evento
    // Esto garantiza que los filtros se apliquen desde el momento en que se carga el componente
    this.filterForm.valueChanges
      .pipe(
        startWith(this.filterForm.value), // Emitir valor inicial inmediatamente
        takeUntil(this.destroy$) // Cancelar suscripción cuando el componente se destruya
      )
      .subscribe(filters => {
        if (this.filterForm.valid) {
          this.applyAdvancedFilters(filters);
        }
      });
  }

  ngAfterViewInit(): void {
    // after render
    // child components are ready
    console.log('ngAfterViewInit')
  }

  ngOnDestroy(): void {
    // Emitir señal para cancelar todas las suscripciones que usan takeUntil(this.destroy$)
    this.destroy$.next();
    this.destroy$.complete();
    console.log('ngOnDestroy');
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
}
