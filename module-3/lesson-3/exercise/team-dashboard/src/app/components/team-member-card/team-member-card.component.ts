import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkillBadgeComponent } from '../skill-badge/skill-badge.component';
import { AvailabilityIndicatorComponent } from '../availability-indicator/availability-indicator.component';
import { AppHoverLiftDirective } from '../../directives/app-hover-lift.directive'; // import custom directive
import { TeamMember } from '../../models/team-member.interface';

@Component({
  selector: 'app-team-member-card',
  imports: [CommonModule, SkillBadgeComponent, AvailabilityIndicatorComponent, AppHoverLiftDirective],
  templateUrl: './team-member-card.component.html',
  styleUrl: './team-member-card.component.css',
})
export class TeamMemberCardComponent {
  @Input() member!: TeamMember;

  // @Output example - Child to Parent communication
  @Output() memberInteraction = new EventEmitter<{
    member: TeamMember
  }>();

  isFavorite = false;

  getSeniorityLevel(): string {
    if (this.member.experience >= 5) return 'Senior';
    if (this.member.experience >= 2) return 'Mid-level';
    return 'Junior';
  }

  // @Output methods - Emit events to parent component
  onToggleFavorite(event: Event) {
    event.stopPropagation(); // Prevent card click
    this.isFavorite = !this.isFavorite;
    console.log('⭐ Emitiendo al componente padre evento favorito:', this.member.name);
    this.memberInteraction.emit({
      member: this.member
    });
  }
}
