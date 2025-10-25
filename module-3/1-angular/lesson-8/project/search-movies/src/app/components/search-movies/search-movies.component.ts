import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ApiService } from '../../services/api.service';
import { FavoritesService } from '../../services/favorites.service';
import { Movie } from '../../models/movie.interface';

@Component({
  selector: 'app-search-movies',
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatPaginatorModule,
    MatSnackBarModule
  ],
  templateUrl: './search-movies.component.html',
  styleUrl: './search-movies.component.css'
})
export class SearchMoviesComponent {
  private apiService = inject(ApiService);
  private favoritesService = inject(FavoritesService);
  private snackBar = inject(MatSnackBar);

  searchTerm: string = '';
  movies: Movie[] = [];
  isLoading: boolean = false;
  hasSearched: boolean = false;
  errorMessage: string = '';

  // Paginación
  totalResults: number = 0;
  currentPage: number = 1;
  pageSize: number = 10;

  searchMovies(page: number = 1): void {
    if (!this.searchTerm.trim()) {
      this.snackBar.open('Por favor ingresa un término de búsqueda', 'Cerrar', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
      return;
    }

    this.isLoading = true;
    this.hasSearched = true;
    this.errorMessage = '';
    this.currentPage = page;

    this.apiService.searchMovies(this.searchTerm, page).subscribe({
      next: (response) => {
        this.isLoading = false;

        if (response.Response === 'True' && response.Search) {
          this.movies = response.Search;
          this.totalResults = parseInt(response.totalResults, 10);
        } else {
          this.movies = [];
          this.totalResults = 0;
          this.errorMessage = response.Error || 'No se encontraron películas';
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'Error al buscar películas. Por favor intenta nuevamente.';
        console.error('Error en búsqueda:', error);
      }
    });
  }

  onPageChange(event: PageEvent): void {
    const page = event.pageIndex + 1;
    this.searchMovies(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  toggleFavorite(movie: Movie): void {
    this.favoritesService.toggleFavorite(movie);
    const isFavorite = this.isFavorite(movie.imdbID);

    this.snackBar.open(
      isFavorite ? '¡Agregada a favoritos!' : 'Eliminada de favoritos',
      'Cerrar',
      {
        duration: 2000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom'
      }
    );
  }

  isFavorite(imdbId: string): boolean {
    return this.favoritesService.isFavorite(imdbId);
  }

  getMoviePoster(poster: string): string {
    return poster !== 'N/A' ? poster : 'https://via.placeholder.com/300x450?text=Sin+Imagen';
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.movies = [];
    this.hasSearched = false;
    this.errorMessage = '';
    this.totalResults = 0;
    this.currentPage = 1;
  }
}

