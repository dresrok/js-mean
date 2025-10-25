import { CommonModule } from '@angular/common';
import { PhoneFormatPipe } from '../../pipes/phone-format.pipe';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TeamMember } from '../../models/team-member.interface';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { TeamMemberService } from '../../services/team-member.service';
import { AvailabilityIndicatorComponent } from '../../components/availability-indicator/availability-indicator.component';
import { SeniorityLevelPipe } from '../../pipes/seniority-level.pipe';
import { YearsAgoPipe } from '../../pipes/years-ago.pipe';
import { SkillBadgeComponent } from '../../components/skill-badge/skill-badge.component';
import { LoadingComponent } from '../../components/loading/loading.component';

@Component({
  selector: 'app-team-member-detail',
  imports: [
    CommonModule,
    RouterLink,
    AvailabilityIndicatorComponent,
    SeniorityLevelPipe,
    PhoneFormatPipe,
    YearsAgoPipe,
    SkillBadgeComponent,
    LoadingComponent,
  ],
  templateUrl: './team-member-detail.component.html',
  styleUrl: './team-member-detail.component.css',
})
export class TeamMemberDetailComponent implements OnInit, OnDestroy {
  member: TeamMember | null = null;

  // Estados de carga y error
  isLoading = false;

  // Subject usado como "señal de destrucción" para cancelar la petición HTTP si el usuario navega
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private teamMemberService: TeamMemberService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');

      // Validar ID
      if (!id || id.trim().length === 0) {
        this.router.navigate(['/not-found']);
        return;
      }

      this.loadMember(id);
    });
  }

  private loadMember(id: string): void {
    this.isLoading = true;

    this.teamMemberService.getMemberById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (member) => {
          this.member = member;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error al cargar miembro:', error);
          this.isLoading = false;
        }
      });
  }

  deleteMember(): void {
    if (!this.member) return;

    const confirmMessage = `¿Estás seguro de que deseas eliminar a ${this.member.name}? Esta acción no se puede deshacer.`;

    if (confirm(confirmMessage)) {
      this.teamMemberService.deleteMember(this.member.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            console.log('Miembro eliminado exitosamente');
            this.router.navigate(['/dashboard']);
          },
          error: (error) => {
            console.error('Error al eliminar miembro:', error);
            alert('Error al eliminar el miembro. Por favor, intenta de nuevo.');
          }
        });
    }
  }

  ngOnDestroy(): void {
    // Emitir señal para cancelar todas las suscripciones pendientes
    this.destroy$.next();
    this.destroy$.complete();
  }
}
