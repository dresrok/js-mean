import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-skill-badge',
  template: `
    <span class="skill-badge">
      {{ skill }}
    </span>
  `,
  styles: `
    .skill-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 0.85em;
      margin: 2px;
      background: #e0e0e0;
      color: #333;
      transition: all 0.3s ease;
    }
    .skill-badge:hover {
      transform: translateY(-2px);
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    }
  `,
})
export class SkillBadgeComponent {
  @Input() skill = '';
}
