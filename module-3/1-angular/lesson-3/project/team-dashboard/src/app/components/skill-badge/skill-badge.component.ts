import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skill-badge',
  imports: [CommonModule],
  template: `
    <span class="skill-badge" [ngClass]="skillClasses">
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
    .angular-skill {
      background: #dd0031;
      color: white;
      font-weight: 500;
      box-shadow: 0 2px 4px rgba(221, 0, 49, 0.3);
    }
    .skill-badge:hover {
      transform: translateY(-2px);
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    }
  `,
})
export class SkillBadgeComponent {
  @Input() skill = '';

  get skillClasses() {
    return {
      'angular-skill': this.skill.toLowerCase().includes('angular')
    };
  }
}
