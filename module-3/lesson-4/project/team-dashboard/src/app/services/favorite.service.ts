import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {
  private readonly STORAGE_KEY = 'team-favorites';
  private favorites: number[] = [];

  constructor() {
    this.loadFavorites();
  }

  toggleFavorite(memberId: number): boolean {
    const index = this.favorites.indexOf(memberId);
    let isFavorite: boolean;

    if (index === -1) {
      this.favorites.push(memberId);
      isFavorite = true;
    } else {
      this.favorites.splice(index, 1);
      isFavorite = false;
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
    } catch (error) {
      this.favorites = [];
    }
  }

  private saveFavorites(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.favorites));
    } catch (error) {
    }
  }
}
