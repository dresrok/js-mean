import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeamMember } from '../../models/team-member.interface';

@Component({
  selector: 'app-team-member-card',
  imports: [CommonModule],
  templateUrl: './team-member-card.component.html',
  styleUrl: './team-member-card.component.css',
})
export class TeamMemberCardComponent {
  @Input() member!: TeamMember;

  @Output() memberInteraction = new EventEmitter<{
    memberId: number;
    memberName: string;
    action: string;
  }>();

  isFavorite = false;

  getSeniorityLevel(): string {
    if (this.member.experience >= 5) return 'Senior';
    if (this.member.experience >= 2) return 'Mid-level';
    return 'Junior';
  }

  onToggleFavorite(event: Event) {
    event.stopPropagation(); // Prevent card click
    this.isFavorite = !this.isFavorite;
    console.log('⭐ Emitiendo al componente padre evento favorito:', this.member.name);
    this.memberInteraction.emit({
      memberId: this.member.id,
      memberName: this.member.name,
      action: 'favorite',
    });
  }
}
