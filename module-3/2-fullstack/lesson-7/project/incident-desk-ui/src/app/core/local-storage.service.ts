import { Injectable } from '@angular/core';

// Pequeño wrapper para centralizar lecturas/escrituras en localStorage y manejar JSON inválido.
@Injectable({ providedIn: 'root' })
export class LocalStorageService {
  // Lee y deserializa un valor del localStorage. Si el JSON es inválido, limpia la clave y retorna null.
  read<T>(key: string): T | null {
    const raw = window.localStorage.getItem(key);
    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw) as T;
    } catch (error) {
      console.warn(`[storage] Invalid JSON for key "${key}"`, error);
      this.remove(key);
      return null;
    }
  }

  // Serializa y guarda un valor en localStorage.
  write<T>(key: string, value: T): void {
    window.localStorage.setItem(key, JSON.stringify(value));
  }

  // Elimina una clave del localStorage.
  remove(key: string): void {
    window.localStorage.removeItem(key);
  }
}
