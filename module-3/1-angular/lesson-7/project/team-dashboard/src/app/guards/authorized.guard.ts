import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthorizedGuard implements CanActivate {
  private isAuthorized = true;

  constructor(private router: Router) { }

  canActivate(): boolean {
    if (this.isAuthorized) {
      return true
    } else {
      alert('Acceso denegado')
      this.router.navigate(['/dashboard'])
      return false
    }
  }
}
