import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-goal-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-header">
      <div class="header-title">
         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="header-icon"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>
         <h2>Mis Metas</h2>
      </div>
      <button (click)="createGoal()" class="btn-primary">Nueva Meta</button>
    </div>

    <!-- Empty State / Skeleton -->
    <div class="card empty-state">
      <div class="empty-content">
        <h3>Aún no tienes metas</h3>
        <p>Comienza creando tu primera meta para realizar un seguimiento.</p>
        <!-- TODO: Implementar lista real cuando haya datos -->
        <div class="todo-notice">
          <small>Nota para el estudiante: Aquí debes implementar el *ngFor para listar las metas obtenidas del backend.</small>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .page-header h2 {
      font-size: 1.5rem;
      font-weight: 600;
      margin: 0;
    }

    .header-title {
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .header-icon {
        color: var(--primary-color);
    }

    .page-header .btn-primary {
      width: auto; /* Override full width */
    }

    .empty-state {
      text-align: center;
      padding: 48px;
    }

    .empty-content h3 {
      font-size: 1.2rem;
      margin-bottom: 8px;
    }

    .todo-notice {
      margin-top: 20px;
      padding: 10px;
      background: #f8f9fa;
      border: 1px dashed #ccc;
      display: inline-block;
      color: #777;
    }
  `]
})
export class GoalListComponent {
  createGoal() {
    console.log('Navegar a crear meta');
    // TODO: Implementar navegación real a /metas/nueva
  }
}
