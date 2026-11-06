import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { JikanMangaResponse } from '../../interfaces/manga-response/manga-response.interface';
import { FilterSelection } from '../../interfaces/common/filter-selection/filter-selection.interface';

@Injectable({ providedIn: 'root' })
export class MangaService {
  private readonly baseUrl = `${environment.apiUrl}/v4/manga`;

  private http = inject(HttpClient);

  private get headers(): HttpHeaders {
    return new HttpHeaders({
      'CF-Access-Client-Id': environment.cfAccessClientId,
      'CF-Access-Client-Secret': environment.cfAccessClientSecret,
    });
  }

  getMangaList(
    page: number = 1,
    limit: number = 20,
    filters?: FilterSelection
  ): Observable<JikanMangaResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    if (filters?.genreId) params = params.set('genres', filters.genreId.toString());
    if (filters?.demographicId) params = params.set('demographics', filters.demographicId.toString());
    if (filters?.status) params = params.set('status', filters.status);

    return this.http.get<JikanMangaResponse>(this.baseUrl, {
      headers: this.headers,
      params,
    });
  }

  /**
   * @function buscarManga
   * @description Busca mangas por texto libre en la API de Jikan (param q)
   */
  buscarManga(texto: string, limit: number = 20): Observable<JikanMangaResponse> {
    const params = new HttpParams()
      .set('q', texto)
      .set('limit', limit.toString());

    return this.http.get<JikanMangaResponse>(this.baseUrl, {
      headers: this.headers,
      params,
    });
  }
}
