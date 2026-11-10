import { Injectable } from '@angular/core';
import { CapacitorHttp, HttpOptions } from '@capacitor/core';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { JikanAnimeResponse } from '../../interfaces/anime-response/anime-response.interface';
import { FilterSelection } from '../../interfaces/common/filter-selection/filter-selection.interface';
import { AnimeModel } from '../../models/anime/anime.model';

@Injectable({ providedIn: 'root' })
export class AnimeService {
  private readonly baseUrl = `${environment.apiUrl}/v4/anime`;

  getAnimeList(
    page: number = 1,
    limit: number = 20,
    filters?: FilterSelection
  ): Observable<JikanAnimeResponse> {
    const params: Record<string, string> = {
      page: page.toString(),
      limit: limit.toString(),
    };

    if (filters?.genreId) params['genres'] = filters.genreId.toString();
    if (filters?.demographicId) params['demographics'] = filters.demographicId.toString();
    if (filters?.status) params['status'] = filters.status;

    const options: HttpOptions = {
      url: this.baseUrl,
      params,
      headers: {
        'CF-Access-Client-Id': environment.cfAccessClientId,
        'CF-Access-Client-Secret': environment.cfAccessClientSecret,
      },
    };

    return from(CapacitorHttp.get(options)).pipe(
      map((response) => response.data as JikanAnimeResponse),
    );
  }

  buscarAnime(texto: string, limit: number = 20): Observable<JikanAnimeResponse> {
    const options: HttpOptions = {
      url: this.baseUrl,
      params: {
        q: texto,
        limit: limit.toString(),
      },
      headers: {
        'CF-Access-Client-Id': environment.cfAccessClientId,
        'CF-Access-Client-Secret': environment.cfAccessClientSecret,
      },
    };

    return from(CapacitorHttp.get(options)).pipe(
      map((response) => response.data as JikanAnimeResponse),
    );
  }

  getAnimeById(id: number): Observable<AnimeModel | null> {
    const options: HttpOptions = {
      url: `${this.baseUrl}/${id}`,
      headers: {
        'CF-Access-Client-Id': environment.cfAccessClientId,
        'CF-Access-Client-Secret': environment.cfAccessClientSecret,
      },
    };

    return from(CapacitorHttp.get(options)).pipe(
      map((response) => (response?.data?.['data'] ? AnimeModel.fromJSON(response.data['data']) : null)),
    );
  }
}
