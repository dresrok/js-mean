import { ResolveFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { EMPTY } from 'rxjs';
import { TeamMember } from '../models/team-member.interface';
import { TeamMemberService } from '../services/team-member.service';

/**
 * Resolver para precargar los datos de un miembro específico antes de activar la ruta
 *
 * Ventajas:
 * - Valida el ID antes de instanciar el componente
 * - Redirige automáticamente si hay errores (404, ID inválido)
 * - El componente recibe datos garantizados (nunca undefined)
 * - Mejor UX: no se muestra pantalla de carga
 *
 * Si hay error, navega manualmente a /not-found y retorna EMPTY para cancelar la navegación actual
 */
export const teamMemberDetailResolver: ResolveFn<TeamMember> = (route) => {
  const teamMemberService = inject(TeamMemberService);
  const router = inject(Router);

  const id = route.paramMap.get('id')!;

  // Obtener miembro por ID y manejar errores
  return teamMemberService.getMemberById(id).pipe(
    catchError(error => {
      console.error('Error al cargar miembro:', error);
      const message = error.status === 404
        ? `Miembro con ID ${id} no encontrado`
        : 'Error al cargar el miembro';

      // Navegar usando state (no query params) - más limpio y no aparece en URL
      router.navigate(['/not-found'], {
        state: {
          title: '404 - Miembro no encontrado',
          message,
          redirectUrl: '/dashboard'
        }
      });

      // Retornar EMPTY cancela la navegación actual
      return EMPTY;
    })
  );
};
