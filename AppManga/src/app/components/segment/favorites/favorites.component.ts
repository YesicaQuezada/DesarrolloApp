import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';

import { FavoritesService, SinSesionError } from '../../../services/favorites/favorites.service';
import { Favorito, FavoritoTipo } from '../../../models/favorito/favorito.model';

@Component({
  selector: 'app-segment',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss'],
  standalone: false,
})
export class FavoriteComponent implements OnInit {
  private favoritosService = inject(FavoritesService);
  private cdr = inject(ChangeDetectorRef);

  segmentoActual: FavoritoTipo = 'anime';
  items: Favorito[] = [];
  loading = false;
  sinSesion = false;
  error = '';

  ngOnInit(): void {
    this.cargar();
  }

  cambiarSegmento(event: any): void {
    this.segmentoActual = event.detail.value as FavoritoTipo;
    this.cargar();
  }

  /**
   * @function quitar
   * @description Elimina un favorito de Firestore y lo saca de la lista.
   */
  async quitar(item: Favorito): Promise<void> {
    try {
      await this.favoritosService.quitar(item.type, item.mediaId);
      this.items = this.items.filter((f) => f.mediaId !== item.mediaId);
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
   * @description Lista los favoritos del segmento actual desde Firestore.
   */
  private async cargar(): Promise<void> {
    this.loading = true;
    this.sinSesion = false;
    this.error = '';

    try {
      this.items = await this.favoritosService.listar(this.segmentoActual);
    } catch (error) {
      this.items = [];
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
