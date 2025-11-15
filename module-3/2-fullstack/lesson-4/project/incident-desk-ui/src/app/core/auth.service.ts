import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { API_URL } from './api.service';
import { LocalStorageService } from './local-storage.service';
import { NotificationsService } from './notifications.service';
import type { User } from '../features/users/user.model';
import { hasPermission, type Permission } from './permissions';

// Representa una sesión de usuario activa con el token de acceso y datos del usuario.
export interface AuthSession {
  accessToken: string;
  user: User;
}

// Credenciales necesarias para iniciar sesión.
export interface LoginPayload {
  email: string;
  password: string;
}

// Respuesta del backend al autenticar. Por ahora coincide con AuthSession.
export interface AuthResponse extends AuthSession { }

const AUTH_STORAGE_KEY = 'incident-desk.auth';

// Servicio que encapsula todo el ciclo de vida de autenticación (login, logout y restauración de sesión).
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly notifications = inject(NotificationsService);
  private readonly storage = inject(LocalStorageService);

  // Signal centralizado que representa la sesión activa y que el resto de la app puede observar.
  private readonly sessionSignal = signal<AuthSession | null>(null);
  readonly session = this.sessionSignal.asReadonly();

  // Al inicializar el servicio, intenta restaurar una sesión desde localStorage.
  constructor() {
    const restored = this.restoreSession();
    if (restored) {
      this.sessionSignal.set(restored);
    }
  }

  // Verifica si existe una sesión activa convirtiendo el signal a un booleano explícito.
  isLoggedIn(): boolean {
    return !!this.sessionSignal();
  }

  // Retorna el usuario actual o null si no hay sesión activa.
  getCurrentUser(): User | null {
    return this.sessionSignal()?.user ?? null;
  }

  // Retorna el token de acceso actual o null si no hay sesión activa.
  getAccessToken(): string | null {
    return this.sessionSignal()?.accessToken ?? null;
  }

  /**
   * Verifica si el usuario actual tiene un permiso específico.
   * @param permission - El permiso a verificar.
   * @returns true si el usuario tiene ese permiso, false en caso contrario.
   */
  checkPermission(permission: Permission): boolean {
    const currentUser = this.getCurrentUser();
    if (!currentUser) {
      return false;
    }
    return hasPermission(currentUser.role, permission);
  }

  /**
   * Verifica si el usuario actual tiene al menos uno de los permisos especificados.
   * @param permissions - Array de permisos a verificar.
   * @returns true si el usuario tiene al menos uno de los permisos, false en caso contrario.
   */
  checkAnyPermission(permissions: Permission[]): boolean {
    return permissions.some((permission) => this.checkPermission(permission));
  }

  // Invoca al backend para autenticar y guarda el resultado localmente.
  async login(payload: LoginPayload): Promise<void> {
    const response = await firstValueFrom(
      this.http.post<AuthResponse>(`${API_URL}/auth/login`, payload)
    );

    const session: AuthSession = {
      accessToken: response.accessToken,
      user: response.user,
    };

    this.persistSession(session);
  }

  // Limpia la sesión y opcionalmente muestra feedback/redirige.
  logout(options: { redirect?: boolean; notify?: boolean } = {}): void {
    this.clearSession();

    if (options.notify) {
      this.notifications.success('Sesión cerrada correctamente');
    }

    if (options.redirect !== false) {
      void this.router.navigate(['/login']);
    }
  }

  // Se ejecuta cuando el interceptor detecta un 401 para forzar un cierre limpio.
  handleUnauthorized(): void {
    this.clearSession();
    this.notifications.error('Tu sesión expiró, inicia sesión nuevamente.');
    void this.router.navigate(['/login']);
  }

  // Guarda la sesión tanto en el signal como en localStorage para persistirla entre recargas.
  private persistSession(session: AuthSession): void {
    this.sessionSignal.set(session);
    this.storage.write<AuthSession>(AUTH_STORAGE_KEY, session);
  }

  // Limpia la sesión del signal y del localStorage.
  private clearSession(): void {
    this.sessionSignal.set(null);
    this.storage.remove(AUTH_STORAGE_KEY);
  }

  // Intenta recuperar la sesión desde localStorage al iniciar la app.
  // Valida que contenga los datos mínimos necesarios; si no, limpia el storage.
  private restoreSession(): AuthSession | null {
    const stored = this.storage.read<AuthSession>(AUTH_STORAGE_KEY);
    if (!stored) {
      return null;
    }
    if (stored.accessToken && stored.user?._id) {
      return stored;
    }

    this.storage.remove(AUTH_STORAGE_KEY);
    return null;
  }
}
