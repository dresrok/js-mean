import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkillBadgeComponent } from '../skill-badge/skill-badge.component';
import { AvailabilityIndicatorComponent } from '../availability-indicator/availability-indicator.component';
import { AppHoverLiftDirective } from '../../directives/app-hover-lift.directive';
import { TeamMember } from '../../models/team-member.interface';
import { SeniorityLevelPipe } from '../../pipes/seniority-level.pipe';
import { PhoneFormatPipe } from '../../pipes/phone-format.pipe';

@Component({
  selector: 'app-team-member-card',
  imports: [CommonModule, SkillBadgeComponent, AvailabilityIndicatorComponent, AppHoverLiftDirective, SeniorityLevelPipe, PhoneFormatPipe],
  templateUrl: './team-member-card.component.html',
  styleUrl: './team-member-card.component.css',
})
export class TeamMemberCardComponent {
  @Input() member!: TeamMember;
  @Input() isFavorite = false;

  // @Output example - Child to Parent communication
  @Output() favoriteInteraction = new EventEmitter<{
    member: TeamMember
  }>();

  // @Output methods - Emit events to parent component
  onToggleFavorite(event: Event) {
    event.stopPropagation(); // Prevent card click
    this.favoriteInteraction.emit({
      member: this.member
    });
  }
}
