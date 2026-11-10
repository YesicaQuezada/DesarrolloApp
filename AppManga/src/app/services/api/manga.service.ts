import { Injectable } from '@angular/core';
import { CapacitorHttp, HttpOptions } from '@capacitor/core';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { JikanMangaResponse } from '../../interfaces/manga-response/manga-response.interface';
import { FilterSelection } from '../../interfaces/common/filter-selection/filter-selection.interface';
import { MangaModel } from '../../models/manga/manga.model';

@Injectable({ providedIn: 'root' })
export class MangaService {
  private readonly baseUrl = `${environment.apiUrl}/v4/manga`;

  getMangaList(
    page: number = 1,
    limit: number = 20,
    filters?: FilterSelection
  ): Observable<JikanMangaResponse> {
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
      map((response) => response.data as JikanMangaResponse),
    );
  }

  buscarManga(texto: string, limit: number = 20): Observable<JikanMangaResponse> {
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
      map((response) => response.data as JikanMangaResponse),
    );
  }

  getMangaById(id: number): Observable<MangaModel | null> {
    const options: HttpOptions = {
      url: `${this.baseUrl}/${id}`,
      headers: {
        'CF-Access-Client-Id': environment.cfAccessClientId,
        'CF-Access-Client-Secret': environment.cfAccessClientSecret,
      },
    };

    return from(CapacitorHttp.get(options)).pipe(
      map((response) => (response?.data?.['data'] ? MangaModel.fromJSON(response.data['data']) : null)),
    );
  }
}
