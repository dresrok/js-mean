import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class NotificationsService {
  private readonly snackBar = inject(MatSnackBar);

  success(message: string): void {
    this.snackBar.open(message, 'Cerrar', { duration: 2500, panelClass: ['snackbar-success'] });
  }

  error(message: string): void {
    this.snackBar.open(message, 'Ver detalle', { duration: 4000, panelClass: ['snackbar-error'] });
  }
}
