import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {
  log(action: string, details?: any): void {
    const timestamp = new Date().toLocaleString();
    console.log(`[${timestamp}] ${action}`, details || '');
  }

  logTeamMemberAction(action: string, member?: any): void {
    this.log(`TEAM_MEMBER: ${action}`, member);
  }

  logFavoriteAction(action: string, memberId?: number): void {
    this.log(`FAVORITE: ${action}`, memberId ? `Member ID: ${memberId}` : '');
  }
}