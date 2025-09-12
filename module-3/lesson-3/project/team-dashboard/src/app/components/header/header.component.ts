import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  template: `
    <header class="dashboard-header">
      <div class="logo-section">
        <h1>
          <strong>{{ companyName }} Dashboard</strong>
        </h1>
        <p class="tagline">Team Management System</p>
      </div>
      <div class="header-stats">
        <span class="date">{{ currentDate }}</span>
        <span class="user" [ngSwitch]="getTimeOfDay()">
          <span *ngSwitchCase="'morning'">Buenos días, {{ userName }}</span>
          <span *ngSwitchCase="'afternoon'">Buenas tardes, {{ userName }}</span>
          <span *ngSwitchDefault>Buenas noches, {{ userName }}</span>
        </span>
      </div>
    </header>
  `,
  styles: `
    .dashboard-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    .dashboard-header h1 {
      font-family: 'Roboto', sans-serif;
      font-weight: 300;
      font-size: 2rem;
      margin: 0;
      color: white;
      letter-spacing: 0.5px;
    }

    .tagline {
      font-family: 'Roboto', sans-serif;
      font-weight: 400;
      font-size: 0.9em;
      opacity: 0.9;
      margin: 5px 0 0 0;
      letter-spacing: 0.3px;
    }

    .header-stats {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 5px;
    }

    .date,
    .user {
      font-family: 'Roboto', sans-serif;
      font-weight: 400;
      font-size: 0.9em;
      opacity: 0.9;
      letter-spacing: 0.2px;
    }

    .user {
      font-weight: 500;
    }
  `,
})
export class HeaderComponent {
  @Input() companyName = 'TechCorp';
  @Input() userName = 'Admin';

  private today = new Date();
  currentDate = this.today.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  getTimeOfDay(): string {
    const hour = this.today.getHours();
    if (hour < 12) return 'morning';
    if (hour < 18) return 'afternoon';
    return 'evening';
  }
}
