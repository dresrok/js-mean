import { Injectable } from '@angular/core';
import { LoggerService } from './logger.service';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {
  private readonly STORAGE_KEY = 'team-favorites';
  private favorites: number[] = [];

  constructor(private logger: LoggerService) {
    this.loadFavorites();
    this.logger.logFavoriteAction('Servicio inicializado', this.favorites.length);
  }

  toggleFavorite(memberId: number): boolean {
    const index = this.favorites.indexOf(memberId);
    let isFavorite: boolean;

    if (index === -1) {
      this.favorites.push(memberId);
      isFavorite = true;
      this.logger.logFavoriteAction('Añadido a favoritos', memberId);
    } else {
      this.favorites.splice(index, 1);
      isFavorite = false;
      this.logger.logFavoriteAction('Removido de favoritos', memberId);
    }

    this.saveFavorites();
    return isFavorite;
  }

  isFavorite(memberId: number): boolean {
    return this.favorites.includes(memberId);
  }

  private loadFavorites(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      this.favorites = stored ? JSON.parse(stored) : [];
      this.logger.logFavoriteAction('Favoritos cargados desde localStorage', this.favorites.length);
    } catch (error) {
      this.logger.logFavoriteAction('Error cargando favoritos, usando array vacío');
      this.favorites = [];
    }
  }

  private saveFavorites(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.favorites));
      this.logger.logFavoriteAction('Favoritos guardados en localStorage', this.favorites.length);
    } catch (error) {
      this.logger.logFavoriteAction('Error guardando favoritos en localStorage');
    }
  }
}
