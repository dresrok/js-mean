import { Injectable } from '@angular/core';
import { TeamMember } from '../models/team-member.interface';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {
  log(action: string, details?: unknown): void {
    const timestamp = new Date().toLocaleString();
    console.log(`[${timestamp}] ${action}`, details || '');
  }

  logTeamMemberAction(action: string, member?: unknown): void {
    this.log(`TEAM_MEMBER: ${action}`, member)
  }

  logFavoriteAction(action: string, memberId?: number): void {
    this.log(`FAVORITE: ${action}`, memberId ? `Member ID: ${memberId}` : '');
  }
}
