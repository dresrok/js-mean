import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FavoritesService } from '../../services/favorites.service';
import { Movie } from '../../models/movie.interface';

@Component({
  selector: 'app-favorite-movies',
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatSnackBarModule,
    MatDialogModule
  ],
  templateUrl: './favorite-movies.component.html',
  styleUrl: './favorite-movies.component.css'
})
export class FavoriteMoviesComponent implements OnInit {
  private favoritesService = inject(FavoritesService);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  favoriteMovies: Movie[] = [];

  ngOnInit(): void {
    // Suscribirse a cambios en favoritos
    this.favoritesService.favorites$.subscribe(favorites => {
      this.favoriteMovies = favorites;
    });
  }

  removeFavorite(movie: Movie): void {
    this.favoritesService.removeFavorite(movie.imdbID);
    
    this.snackBar.open(
      `"${movie.Title}" eliminada de favoritos`,
      'Deshacer',
      {
        duration: 4000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom'
      }
    ).onAction().subscribe(() => {
      // Si hace clic en "Deshacer", volver a agregar
      this.favoritesService.addFavorite(movie);
    });
  }

  clearAllFavorites(): void {
    if (this.favoriteMovies.length === 0) return;

    const confirmed = confirm(
      `¿Estás seguro de que deseas eliminar todas las películas favoritas (${this.favoriteMovies.length})?`
    );

    if (confirmed) {
      this.favoritesService.clearFavorites();
      this.snackBar.open(
        'Todos los favoritos han sido eliminados',
        'Cerrar',
        {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom'
        }
      );
    }
  }

  getMoviePoster(poster: string): string {
    return poster !== 'N/A' ? poster : 'https://via.placeholder.com/300x450?text=Sin+Imagen';
  }

  get hasMovies(): boolean {
    return this.favoriteMovies.length > 0;
  }

  get moviesCount(): number {
    return this.favoriteMovies.length;
  }
}

