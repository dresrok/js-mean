import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

// Servicio que centraliza las notificaciones tipo snackbar para mensajes al usuario.
@Injectable({ providedIn: 'root' })
export class NotificationsService {
  private readonly snackBar = inject(MatSnackBar);

  // Muestra un mensaje de éxito con estilo personalizado.
  success(message: string): void {
    this.snackBar.open(message, 'Cerrar', { duration: 2500, panelClass: ['snackbar-success'] });
  }

  // Muestra un mensaje de error con mayor duración para lectura.
  error(message: string): void {
    this.snackBar.open(message, 'Ver detalle', { duration: 4000, panelClass: ['snackbar-error'] });
  }
}
