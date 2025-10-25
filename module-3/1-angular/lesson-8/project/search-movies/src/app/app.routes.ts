import { Routes } from '@angular/router';
import { SearchMoviesComponent } from './components/search-movies/search-movies.component';
import { FavoriteMoviesComponent } from './components/favorite-movies/favorite-movies.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/search',
    pathMatch: 'full'
  },
  {
    path: 'search',
    component: SearchMoviesComponent,
    title: 'Buscar Películas'
  },
  {
    path: 'favorites',
    component: FavoriteMoviesComponent,
    title: 'Mis Favoritos'
  },
  {
    path: '**',
    redirectTo: '/search'
  }
];
