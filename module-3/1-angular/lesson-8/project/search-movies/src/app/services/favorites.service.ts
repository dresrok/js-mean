import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Movie } from '../models/movie.interface';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private readonly STORAGE_KEY = 'favoriteMovies';
  private favoritesSubject: BehaviorSubject<Movie[]>;
  public favorites$: Observable<Movie[]>;

  constructor() {
    const savedFavorites = this.loadFromStorage();
    this.favoritesSubject = new BehaviorSubject<Movie[]>(savedFavorites);
    this.favorites$ = this.favoritesSubject.asObservable();
  }

  /**
   * Obtiene las películas favoritas desde localStorage
   */
  private loadFromStorage(): Movie[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error al cargar favoritos desde localStorage:', error);
      return [];
    }
  }

  /**
   * Guarda las películas favoritas en localStorage
   */
  private saveToStorage(favorites: Movie[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(favorites));
    } catch (error) {
      console.error('Error al guardar favoritos en localStorage:', error);
    }
  }

  /**
   * Obtiene todas las películas favoritas
   */
  getFavorites(): Movie[] {
    return this.favoritesSubject.value;
  }

  /**
   * Agrega una película a favoritos
   */
  addFavorite(movie: Movie): void {
    const currentFavorites = this.getFavorites();

    // Verifica si la película ya está en favoritos
    if (!this.isFavorite(movie.imdbID)) {
      const updatedFavorites = [...currentFavorites, movie];
      this.favoritesSubject.next(updatedFavorites);
      this.saveToStorage(updatedFavorites);
    }
  }

  /**
   * Elimina una película de favoritos
   */
  removeFavorite(imdbId: string): void {
    const currentFavorites = this.getFavorites();
    const updatedFavorites = currentFavorites.filter(movie => movie.imdbID !== imdbId);
    this.favoritesSubject.next(updatedFavorites);
    this.saveToStorage(updatedFavorites);
  }

  /**
   * Verifica si una película está en favoritos
   */
  isFavorite(imdbId: string): boolean {
    return this.getFavorites().some(movie => movie.imdbID === imdbId);
  }

  /**
   * Alterna el estado de favorito de una película
   */
  toggleFavorite(movie: Movie): void {
    if (this.isFavorite(movie.imdbID)) {
      this.removeFavorite(movie.imdbID);
    } else {
      this.addFavorite(movie);
    }
  }

  /**
   * Limpia todos los favoritos
   */
  clearFavorites(): void {
    this.favoritesSubject.next([]);
    this.saveToStorage([]);
  }

  /**
   * Obtiene el número total de favoritos
   */
  getFavoritesCount(): number {
    return this.getFavorites().length;
  }
}

