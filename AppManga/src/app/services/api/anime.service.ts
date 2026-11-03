import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { JikanAnimeResponse } from '../../models/anime/anime.model';
import { FilterSelection } from '../../models/filters/filter.model';

@Injectable({ providedIn: 'root' })
export class AnimeService {
  private readonly baseUrl = `${environment.apiUrl}/v4/anime`;

  constructor(private http: HttpClient) {}

  getAnimeList(
    page: number = 1,
    limit: number = 20,
    filters?: FilterSelection
  ): Observable<JikanAnimeResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    if (filters?.genreId) params = params.set('genres', filters.genreId.toString());
    if (filters?.demographicId) params = params.set('demographics', filters.demographicId.toString());
    if (filters?.status) params = params.set('status', filters.status);

    return this.http.get<JikanAnimeResponse>(this.baseUrl, {
      params,
    });
  }
}
