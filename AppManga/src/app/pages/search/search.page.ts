import { Component, OnDestroy, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { addIcons } from 'ionicons';
import { heart, heartOutline } from 'ionicons/icons';

import { MangaService } from '../../services/api/manga.service';
import { MangaModel } from '../../models/manga/manga.model';
import {
  FavoritesService,
  SinSesionError,
} from '../../services/favorites/favorites.service';
import { Favorito } from '../../models/favorito/favorito.model';

@Component({
  selector: 'app-search-page',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
  standalone: false,
})
export class SearchPage implements OnInit, OnDestroy {
  private mangaService = inject(MangaService);
  private favoritosService = inject(FavoritesService);
  private cdr = inject(ChangeDetectorRef);
  private busquedaSub?: Subscription;

  resultados: MangaModel[] = [];
  /** mal_id de los resultados que ya están marcados como favoritos. */
  favoritos = new Set<number>();
  loading = false;
  error = '';

  constructor() {
    addIcons({ heart, heartOutline });
  }

  ngOnInit(): void {
    this.buscar('');
  }

  ngOnDestroy(): void {
    this.busquedaSub?.unsubscribe();
  }

  alBuscar(texto: string): void {
    this.buscar(texto);
  }

  esFavorito(mediaId: number): boolean {
    return this.favoritos.has(mediaId);
  }

  /**
   * @function alternarFavorito
   * @description Agrega o quita un resultado de la búsqueda de favoritos.
   */
  async alternarFavorito(manga: MangaModel): Promise<void> {
    try {
      if (this.favoritos.has(manga.mal_id)) {
        await this.favoritosService.quitar('manga', manga.mal_id);
        this.favoritos.delete(manga.mal_id);
      } else {
        await this.favoritosService.agregar(
          new Favorito({
            mediaId: manga.mal_id,
            type: 'manga',
            title: manga.title,
            image: manga.images.jpg.large_image_url,
            addedAt: new Date(),
          })
        );
        this.favoritos.add(manga.mal_id);
      }
    } catch (error) {
      if (error instanceof SinSesionError) {
        console.warn('Inicia sesión para guardar favoritos.');
      } else {
        console.error('Error al actualizar favorito:', error);
      }
    }
    // Angular 22 solo refresca vistas marcadas: tras un `await` hay que marcarla.
    this.cdr.markForCheck();
  }

  /**
   * @function buscar
   * @description Consulta la API de Jikan: lista general sin texto, o por texto libre (q)
   */
  private buscar(texto: string): void {
    this.busquedaSub?.unsubscribe();
    this.loading = true;
    this.error = '';

    const query = texto.trim();
    const peticion = query
      ? this.mangaService.buscarManga(query)
      : this.mangaService.getMangaList(1, 20);

    this.busquedaSub = peticion.subscribe({
      next: (respuesta) => {
        this.resultados = MangaModel.fromJSONArray(respuesta.data);
        this.loading = false;
        // Angular 22 solo refresca vistas marcadas: tras un `await` hay que marcarla.
        this.cdr.markForCheck();
        this.marcarFavoritos();
      },
      error: () => {
        this.error = 'No se pudieron cargar los resultados.';
        this.loading = false;
        this.cdr.markForCheck();
      },
    });
  }

  /**
   * @function marcarFavoritos
   * @description Cruza los resultados con los favoritos guardados en Firestore.
   * Si no hay sesión, se queda sin marcar (sin romper la búsqueda).
   */
  private async marcarFavoritos(): Promise<void> {
    this.favoritos = new Set<number>();
    try {
      for (const m of this.resultados) {
        if (await this.favoritosService.esFavorito('manga', m.mal_id)) {
          this.favoritos.add(m.mal_id);
        }
      }
    } catch {
      // Sin sesión o sin red: no se marcan favoritos.
    }
    // Angular 22 solo refresca vistas marcadas: tras un `await` hay que marcarla.
    this.cdr.markForCheck();
  }
}
