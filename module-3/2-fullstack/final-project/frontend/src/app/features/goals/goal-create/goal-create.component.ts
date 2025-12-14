import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-goal-create',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="create-container">
      <div class="page-header">
        <h2>Crear Nueva Meta</h2>
      </div>

      <div class="card form-card">
        <form>
          <div class="form-group">
            <label>Descripción de la Meta</label>
            <input type="text" placeholder="Ej: Aprender Angular Avanzado">
          </div>

          <div class="form-actions">
            <button class="btn-cancel" type="button">Cancelar</button>
            <button class="btn-primary" type="button">Guardar Meta</button>
          </div>

          <div class="todo-notice">
            <small>Nota: Implementar ReactiveForms o ngModel aquí y conectar con el servicio.</small>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .create-container {
      max-width: 600px;
      margin: 0 auto;
    }

    .page-header {
      margin-bottom: 24px;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 24px;
    }

    .btn-primary {
      width: auto;
    }

    .btn-cancel {
      background: white;
      border: 1px solid var(--border-color);
      padding: 10px 16px;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 600;
      color: var(--text-secondary);
    }

    .btn-cancel:hover {
      background: #f1f5f9;
    }

    .todo-notice {
      margin-top: 20px;
      padding: 10px;
      background: #fff3cd;
      color: #856404;
      border: 1px solid #ffeeba;
      border-radius: 4px;
      font-size: 0.85rem;
    }
  `]
})
export class GoalCreateComponent {
  // TODO: Implementar lógica
}
