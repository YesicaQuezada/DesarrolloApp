import { Component, OnDestroy, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { addIcons } from 'ionicons';
import { heart, heartOutline } from 'ionicons/icons';

import { MangaService } from '../../services/api/manga.service';
import { AnimeService } from '../../services/api/anime.service';
import { MangaModel } from '../../models/manga/manga.model';
import { AnimeModel } from '../../models/anime/anime.model';
import { ItemJikan } from '../../models/item-jikan/item-jikan.model';
import {
  FavoritesService,
  SinSesionError,
} from '../../services/favorites/favorites.service';
import { Favorito } from '../../models/favorito/favorito.model';
import { TipoMedio } from '../../components/media-segment/media-segment.component';
import { PeticionBusqueda } from '../../components/search/search.component';
import { JikanAnimeResponse } from '../../interfaces/anime-response/anime-response.interface';
import { JikanMangaResponse } from '../../interfaces/manga-response/manga-response.interface';

@Component({
  selector: 'app-search-page',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
  standalone: false,
})
export class SearchPage implements OnInit, OnDestroy {
  private mangaService = inject(MangaService);
  private animeService = inject(AnimeService);
  private favoritosService = inject(FavoritesService);
  private cdr = inject(ChangeDetectorRef);
  private busquedaSub?: Subscription;

  /** Resultados tipados por la base común: la plantilla no distingue medio. */
  resultados: ItemJikan[] = [];
  /** Solapa activa: define en qué medio se guarda cada favorito. */
  tipo: TipoMedio = 'manga';
  /** mal_id de los resultados que ya están marcados como favoritos. */
  favoritos = new Set<number>();
  /** Descarta recorridos de marcado que quedaron viejos al terminar. */
  private marcasGeneracion = 0;
  loading = false;
  error = '';

  constructor() {
    addIcons({ heart, heartOutline });
  }

  ngOnInit(): void {
    this.buscar({ texto: '', tipo: this.tipo });
  }

  ngOnDestroy(): void {
    this.busquedaSub?.unsubscribe();
  }

  /**
   * @function alBuscar
   * @description Recibe la búsqueda completa (texto + medio) desde la barra
   * o desde el cambio de solapa, y la ejecuta.
   */
  alBuscar(peticion: PeticionBusqueda): void {
    // Al cambiar de solapa se descartan las marcas de la anterior: decidir
    // "agregar o quitar" con ids de otro medio puede borrar un favorito
    // (p. ej. Monster y Cowboy Bebop comparten mal_id 1).
    if (peticion.tipo !== this.tipo) this.favoritos = new Set<number>();
    this.tipo = peticion.tipo;
    this.buscar(peticion);
  }

  esFavorito(mediaId: number): boolean {
    return this.favoritos.has(mediaId);
  }

  /**
   * @function alternarFavorito
   * @description Agrega o quita un resultado de la búsqueda de favoritos,
   * guardándolo con el medio de la solapa activa.
   */
  async alternarFavorito(item: ItemJikan): Promise<void> {
    try {
      if (this.favoritos.has(item.mal_id)) {
        await this.favoritosService.quitar(this.tipo, item.mal_id);
        this.favoritos.delete(item.mal_id);
      } else {
        await this.favoritosService.agregar(
          new Favorito({
            mediaId: item.mal_id,
            type: this.tipo,
            title: item.title,
            image: item.images.jpg.large_image_url,
            addedAt: new Date(),
          })
        );
        this.favoritos.add(item.mal_id);
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
   * @description Consulta Jikan contra el medio de la solapa: lista general
   * sin texto, o por texto libre (q). Cada cambio cancela el anterior.
   */
  private buscar(peticion: PeticionBusqueda): void {
    this.busquedaSub?.unsubscribe();
    this.loading = true;
    this.error = '';

    const query = peticion.texto.trim();
    const esAnime = peticion.tipo === 'anime';

    const peticion$: Observable<JikanAnimeResponse | JikanMangaResponse> = esAnime
      ? query
        ? this.animeService.buscarAnime(query)
        : this.animeService.getAnimeList(1, 20)
      : query
        ? this.mangaService.buscarManga(query)
        : this.mangaService.getMangaList(1, 20);

    this.busquedaSub = peticion$.subscribe({
      next: (respuesta) => {
        this.resultados = esAnime
          ? AnimeModel.fromJSONArray(respuesta.data)
          : MangaModel.fromJSONArray(respuesta.data);
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
   * @description Cruza los resultados con los favoritos guardados en la RTDB.
   * Si no hay sesión, se queda sin marcar (sin romper la búsqueda).
   *
   * Los resultados se acumulan en un Set local y solo se publican si la
   * vuelta sigue siendo la última (generación y medio): un recorrido viejo
   * que termine tarde no debe contaminar el Set que usa la solapa actual
   * para decidir entre agregar y quitar.
   */
  private async marcarFavoritos(): Promise<void> {
    const generacion = ++this.marcasGeneracion;
    // Congela medio y lista: si el usuario cambia de solapa o escribe otra
    // cosa a mitad de recorrido, no marcaría con el tipo equivocado.
    const tipo = this.tipo;
    const resultados = [...this.resultados];
    const marcados = new Set<number>();
    try {
      for (const m of resultados) {
        if (await this.favoritosService.esFavorito(tipo, m.mal_id)) {
          marcados.add(m.mal_id);
        }
      }
    } catch {
      // Sin sesión o sin red: no se marcan favoritos.
    }
    if (generacion === this.marcasGeneracion && tipo === this.tipo) {
      this.favoritos = marcados;
      // Angular 22 solo refresca vistas marcadas: tras un `await` hay que marcarla.
      this.cdr.markForCheck();
    }
  }
}
