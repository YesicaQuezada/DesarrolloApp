import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { JikanGenre } from '../../interfaces/common/jikan-genre/jikan-genre.interface';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

@Injectable({ providedIn: 'root' })
export class FilterService {
  private readonly TTL = 24 * 60 * 60 * 1000;

  private http = inject(HttpClient);

  getGenres(type: 'manga' | 'anime'): Observable<JikanGenre[]> {
    return this.fetchWithCache<JikanGenre[]>(`genres_${type}`, () =>
      this.http.get<{ data: JikanGenre[] }>(`${environment.apiUrl}/v4/genres/${type}`)
        .pipe(map((res) => res.data))
    );
  }

  getDemographics(type: 'manga' | 'anime'): Observable<JikanGenre[]> {
    return this.fetchWithCache<JikanGenre[]>(`demographics_${type}`, () =>
      this.http.get<{ data: JikanGenre[] }>(`${environment.apiUrl}/v4/genres/${type}`, {
        params: new HttpParams().set('filter', 'demographics'),
      }).pipe(map((res) => res.data))
    );
  }

  private fetchWithCache<T>(key: string, fetchFn: () => Observable<T>): Observable<T> {
    const cached = this.readCache<T>(key);
    if (cached) {
      return of(cached);
    }
    return fetchFn().pipe(tap((data) => this.writeCache(key, data)));
  }

  private readCache<T>(key: string): T | null {
    try {
      const raw = localStorage.getItem(`filter_cache_${key}`);
      if (!raw) return null;
      const entry: CacheEntry<T> = JSON.parse(raw);
      if (Date.now() - entry.timestamp > this.TTL) {
        localStorage.removeItem(`filter_cache_${key}`);
        return null;
      }
      return entry.data;
    } catch {
      return null;
    }
  }

  private writeCache<T>(key: string, data: T): void {
    try {
      const entry: CacheEntry<T> = { data, timestamp: Date.now() };
      localStorage.setItem(`filter_cache_${key}`, JSON.stringify(entry));
    } catch {
      // localStorage lleno o bloqueado, ignorar
    }
  }
}
