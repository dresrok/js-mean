import { CommonModule } from '@angular/common';
import { PhoneFormatPipe } from '../../pipes/phone-format.pipe';
import { Component, OnInit } from '@angular/core';
import { TeamMember } from '../../models/team-member.interface';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { TeamMemberService } from '../../services/team-member.service';
import { AvailabilityIndicatorComponent } from '../../components/availability-indicator/availability-indicator.component';
import { SeniorityLevelPipe } from '../../pipes/seniority-level.pipe';
import { YearsAgoPipe } from '../../pipes/years-ago.pipe';
import { SkillBadgeComponent } from '../../components/skill-badge/skill-badge.component';

@Component({
  selector: 'app-team-member-detail',
  imports: [
    CommonModule,
    RouterLink,
    AvailabilityIndicatorComponent,
    SeniorityLevelPipe,
    PhoneFormatPipe,
    YearsAgoPipe,
    SkillBadgeComponent,
  ],
  templateUrl: './team-member-detail.component.html',
  styleUrl: './team-member-detail.component.css',
})
export class TeamMemberDetailComponent implements OnInit {
  member: TeamMember | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private teamMemberService: TeamMemberService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      const foundMember = this.teamMemberService.getMemberById(id);
      this.member = foundMember || null;

      if (!foundMember) {
        alert('Usuario no encontrado');
        this.router.navigate(['/dashboard']);
      }
    });
  }
}
