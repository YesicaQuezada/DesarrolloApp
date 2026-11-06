import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ChangeDetectorRef,
  inject,
} from '@angular/core';
import { addIcons } from 'ionicons';
import { heart, heartOutline } from 'ionicons/icons';

import { MangaModel } from '../../../models/manga/manga.model';
import {
  FavoritesService,
  SinSesionError,
} from '../../../services/favorites/favorites.service';

@Component({
  selector: 'app-manga-card',
  templateUrl: './manga-card.component.html',
  styleUrls: ['./manga-card.component.scss'],
  standalone: false,
})
export class MangaCardComponent implements OnInit {
  @Input() manga!: MangaModel;
  @Output() cardClick = new EventEmitter<MangaModel>();

  private favoritos = inject(FavoritesService);
  private cdr = inject(ChangeDetectorRef);

  esFavorito = false;

  constructor() {
    addIcons({ heart, heartOutline });
  }

  ngOnInit(): void {
    this.favoritos
      .esFavorito('manga', this.manga.mal_id)
      .then((ok) => {
        this.esFavorito = ok;
        // Angular 22 solo refresca vistas marcadas: tras un `await` hay que marcarla.
        this.cdr.markForCheck();
      })
      .catch(() => {
        // Sin sesión o sin red: se queda sin marcar.
      });
  }

  /**
   * @function alternarFavorito
   * @description Agrega o quita el manga de favoritos sin disparar el click de la card.
   */
  async alternarFavorito(event: Event): Promise<void> {
    event.stopPropagation();
    event.preventDefault();

    try {
      if (this.esFavorito) {
        await this.favoritos.quitar('manga', this.manga.mal_id);
        this.esFavorito = false;
      } else {
        await this.favoritos.agregar({
          mediaId: this.manga.mal_id,
          type: 'manga',
          title: this.manga.title,
          image: this.manga.images.jpg.large_image_url,
          addedAt: new Date(),
        });
        this.esFavorito = true;
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

  onClick(): void {
    this.cardClick.emit(this.manga);
  }
}
