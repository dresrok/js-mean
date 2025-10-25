import { Injectable } from '@angular/core';
import { LoggerService } from './logger.service';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {
  private readonly STORAGE_KEY = 'team-favorites';
  private favorites: string[] = [];

  constructor(private logger: LoggerService) {
    this.loadFavorites();
    this.logger.logFavoriteAction('Servicio Favorite Inicializado')
  }

  toggleFavorite(memberId: string): boolean {
    const index = this.favorites.indexOf(memberId);
    let isFavorite: boolean;

    if (index === -1) {
      this.favorites.push(memberId);
      isFavorite = true;
      this.logger.logFavoriteAction('Añadido a favoritos', memberId)
    } else {
      this.favorites.splice(index, 1);
      isFavorite = false;
      this.logger.logFavoriteAction('Removido de favoritos', memberId)
    }

    this.saveFavorites();
    return isFavorite;
  }

  isFavorite(memberId: string): boolean {
    return this.favorites.includes(memberId);
  }

  private loadFavorites(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      this.favorites = stored ? JSON.parse(stored) : []
    } catch (error) {
      this.favorites = []
    }
  }

  private saveFavorites() {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.favorites))
    } catch (error) {

    }
  }
}
