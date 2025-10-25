import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-availability',
  imports: [CommonModule],
  template: `
    <div class="availability-container">
      <span class="status-dot" [ngStyle]="getStatusStyles()"> </span>
      <span class="status-text">{{ status }}</span>
    </div>
  `,
  styles: `
    .availability-container {
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }
    .status-dot {
      border-radius: 50%;
      display: inline-block;
      animation: pulse 2s infinite;
    }
    .status-text {
      font-size: 0.9em;
      color: #666;
      text-transform: capitalize;
    }
    @keyframes pulse {
      0% {
        opacity: 1;
      }
      50% {
        opacity: 0.5;
      }
      100% {
        opacity: 1;
      }
    }
  `,
})
export class AvailabilityIndicatorComponent {
  @Input() status: 'disponible' | 'ocupado' | 'ausente' | 'desconectado' = 'desconectado';

  getStatusStyles() {
    const colors = {
      disponible: '#4caf50',
      ocupado: '#f44336',
      ausente: '#ff9800',
      desconectado: '#9e9e9e',
    };
    return {
      'background-color': colors[this.status],
      'width': '10px',
      'height': '10px'
    };
  }
}
