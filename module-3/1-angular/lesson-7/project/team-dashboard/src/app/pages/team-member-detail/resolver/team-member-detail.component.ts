import { CommonModule } from '@angular/common';
import { PhoneFormatPipe } from '../../../pipes/phone-format.pipe';
import { Component, OnInit } from '@angular/core';
import { TeamMember } from '../../../models/team-member.interface';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { AvailabilityIndicatorComponent } from '../../../components/availability-indicator/availability-indicator.component';
import { SeniorityLevelPipe } from '../../../pipes/seniority-level.pipe';
import { YearsAgoPipe } from '../../../pipes/years-ago.pipe';
import { SkillBadgeComponent } from '../../../components/skill-badge/skill-badge.component';
import { TeamMemberService } from '../../../services/team-member.service';

/**
 * Componente simplificado que usa un resolver para precargar datos
 *
 * Ventajas del enfoque con resolver:
 * - Componente ultra simple: solo 10 líneas de TypeScript
 * - Sin lógica de carga: no hay isLoading, error, ni loadMember()
 * - Sin suscripciones: no necesita ngOnDestroy ni takeUntil
 * - Sin TeamMemberService: el resolver se encarga de todo
 * - Validación centralizada: el resolver valida IDs y maneja 404s
 * - Mejor UX: usuario nunca ve pantalla de carga
 */
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
  ],
  templateUrl: './team-member-detail.component.html',
  styleUrl: './team-member-detail.component.css',
})
export class TeamMemberDetailResolverComponent implements OnInit {
  // El resolver garantiza que member siempre existe (usa ! en lugar de | null)
  member!: TeamMember;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private teamMemberService: TeamMemberService
  ) { }

  ngOnInit(): void {
    // Obtener datos precargados del resolver
    this.member = this.route.snapshot.data['member'];

    // Nota: Si llegas aquí, el member siempre existe
    // porque el resolver redirige automáticamente si no lo encuentra
  }

  deleteMember(): void {
    const confirmMessage = `¿Estás seguro de que deseas eliminar a ${this.member.name}? Esta acción no se puede deshacer.`;

    if (confirm(confirmMessage)) {
      this.teamMemberService.deleteMember(this.member.id).subscribe({
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
}
