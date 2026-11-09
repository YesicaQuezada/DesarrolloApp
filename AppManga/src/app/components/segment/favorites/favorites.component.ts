import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';

import { FavoritesService, SinSesionError } from '../../../services/favorites/favorites.service';
import { Favorito } from '../../../models/favorito/favorito.model';
import { TipoMedio } from '../../media-segment/media-segment.component';

/** Favoritos por página en la lista. */
const POR_PAGINA = 20;

@Component({
  selector: 'app-segment',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss'],
  standalone: false,
})
export class FavoriteComponent implements OnInit {
  private favoritosService = inject(FavoritesService);
  private cdr = inject(ChangeDetectorRef);

  /** Solapa activa: mismo estándar que Home y Buscar (Manga primero). */
  segmentoActual: TipoMedio = 'manga';
  items: Favorito[] = [];
  /** Página visible (base 1). */
  paginaActual = 1;
  loading = false;
  sinSesion = false;
  error = '';

  ngOnInit(): void {
    this.cargar();
  }

  /** Cantidad de páginas que salen de la lista completa. */
  get totalPaginas(): number {
    return Math.max(Math.ceil(this.items.length / POR_PAGINA), 1);
  }

  /** Solo los favoritos de la página activa: la lista no se corta sola. */
  get itemsVisibles(): Favorito[] {
    const inicio = (this.paginaActual - 1) * POR_PAGINA;
    return this.items.slice(inicio, inicio + POR_PAGINA);
  }

  cambiarSegmento(tipo: TipoMedio): void {
    this.segmentoActual = tipo;
    this.paginaActual = 1;
    this.cargar();
  }

  /** @function cambiarPagina - Muestra otra página de la lista. */
  cambiarPagina(page: number): void {
    this.paginaActual = page;
    // Angular 22 solo refresca vistas marcadas.
    this.cdr.markForCheck();
  }

  /**
   * @function quitar
   * @description Elimina un favorito de la RTDB y lo saca de la lista.
   */
  async quitar(item: Favorito): Promise<void> {
    try {
      await this.favoritosService.quitar(item.type, item.mediaId);
      this.items = this.items.filter((f) => f.mediaId !== item.mediaId);
      // Si al borrar se quedó sin páginas, retrocede a la última válida.
      this.paginaActual = Math.min(this.paginaActual, this.totalPaginas);
    } catch (error) {
      if (error instanceof SinSesionError) {
        this.sinSesion = true;
      } else {
        this.error = 'No se pudo quitar el favorito.';
      }
    }
    // Angular 22 solo refresca vistas marcadas: tras un `await` hay que marcarla.
    this.cdr.markForCheck();
  }

  /**
   * @function cargar
   * @description Lista los favoritos del segmento actual desde la RTDB.
   */
  private async cargar(): Promise<void> {
    this.loading = true;
    this.sinSesion = false;
    this.error = '';

    try {
      this.items = await this.favoritosService.listar(this.segmentoActual);
      this.paginaActual = 1;
    } catch (error) {
      this.items = [];
      this.paginaActual = 1;
      if (error instanceof SinSesionError) {
        this.sinSesion = true;
      } else {
        this.error = 'No se pudieron cargar los favoritos.';
      }
    } finally {
      this.loading = false;
      // Angular 22 solo refresca vistas marcadas: tras un `await` hay que marcarla.
      this.cdr.markForCheck();
    }
  }
}
