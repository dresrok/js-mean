import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TeamMember } from '../../models/team-member.interface';
import { SkillBadgeComponent } from "../skill-badge/skill-badge.component";
import { CommonModule } from '@angular/common';
import { AvailabilityIndicatorComponent } from "../availability-indicator/availability-indicator.component";
import { AppHoverLiftDirective } from "../../directives/app-hover-lift.directive";
import { SeniorityLevelPipe } from '../../pipes/seniority-level.pipe';
import { PhoneFormatPipe } from '../../pipes/phone-format.pipe';
import { YearsAgoPipe } from '../../pipes/years-ago.pipe';

import { Router } from '@angular/router'

@Component({
  selector: 'app-team-member-card',
  templateUrl: './team-member-card.component.html',
  styleUrl: './team-member-card.component.css',
  imports: [CommonModule, SkillBadgeComponent, AvailabilityIndicatorComponent, AppHoverLiftDirective, SeniorityLevelPipe, PhoneFormatPipe, YearsAgoPipe],
})
export class TeamMemberCardComponent {
  @Input() member!: TeamMember;
  @Input() isFavorite = false;

  @Input() memberDetailBtnText = 'Ver Perfil';
  @Input() memberDetailRoute = '/team-members';

  @Output() clickFavorite = new EventEmitter<{
    member: TeamMember
  }>

  constructor(private router: Router) { }

  onToggleFavorite(event: Event) {
    event.stopPropagation();
    this.clickFavorite.emit({
      member: this.member
    })
  }

  viewMemberDetail() {
    this.router.navigate([this.memberDetailRoute, this.member.id]);
  }

}
