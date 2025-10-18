import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { MovieSearchResponse } from '../models/movie.interface';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;
  private apiKey = environment.apiKey;

  constructor(private http: HttpClient) { }

  /**
   * Busca películas por nombre
   * @param searchTerm Término de búsqueda
   * @param page Número de página (por defecto 1)
   * @returns Observable con la respuesta de la API
   */
  searchMovies(searchTerm: string, page: number = 1): Observable<MovieSearchResponse> {
    const params = new HttpParams()
      .set('apikey', this.apiKey)
      .set('s', searchTerm)
      .set('page', page.toString());

    return this.http.get<MovieSearchResponse>(this.apiUrl, { params }).pipe(
      catchError((error) => {
        console.error('Error al buscar películas:', error);
        return of({
          Search: [],
          totalResults: '0',
          Response: 'False',
          Error: 'Error al conectar con la API'
        });
      })
    );
  }

  /**
   * Obtiene los detalles de una película por su ID de IMDb
   * @param imdbId ID de IMDb de la película
   * @returns Observable con los detalles de la película
   */
  getMovieDetails(imdbId: string): Observable<any> {
    const params = new HttpParams()
      .set('apikey', this.apiKey)
      .set('i', imdbId);

    return this.http.get<any>(this.apiUrl, { params }).pipe(
      catchError((error) => {
        console.error('Error al obtener detalles de película:', error);
        return of(null);
      })
    );
  }
}

