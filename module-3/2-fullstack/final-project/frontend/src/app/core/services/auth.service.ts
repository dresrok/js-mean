import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable, tap } from 'rxjs';
import { LoginResponse, User } from '../models/auth.models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userKey = 'user';
  private tokenKey = 'token';

  constructor(private api: ApiService) { }

  login(credentials: { email: string, password: string }): Observable<LoginResponse> {
    return this.api.post<LoginResponse>('auth/login', credentials).pipe(
      tap((response: LoginResponse) => {
        if (response.token) {
          localStorage.setItem(this.tokenKey, response.token);
          localStorage.setItem(this.userKey, JSON.stringify(response));
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  getUser(): User | null {
    const userStr = localStorage.getItem(this.userKey);
    return userStr ? JSON.parse(userStr) as User : null;
  }
}
