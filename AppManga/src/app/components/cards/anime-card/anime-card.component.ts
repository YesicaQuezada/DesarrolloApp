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

import { AnimeModel } from '../../../models/anime/anime.model';
import {
  FavoritesService,
  SinSesionError,
} from '../../../services/favorites/favorites.service';
import { Favorito } from '../../../models/favorito/favorito.model';

@Component({
  selector: 'app-anime-card',
  templateUrl: './anime-card.component.html',
  styleUrls: ['./anime-card.component.scss'],
  standalone: false,
})
export class AnimeCardComponent implements OnInit {
  @Input() anime!: AnimeModel;
  @Output() cardClick = new EventEmitter<AnimeModel>();

  private favoritos = inject(FavoritesService);
  private cdr = inject(ChangeDetectorRef);

  esFavorito = false;

  constructor() {
    addIcons({ heart, heartOutline });
  }

  ngOnInit(): void {
    this.favoritos
      .esFavorito('anime', this.anime.mal_id)
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
   * @description Agrega o quita el anime de favoritos sin disparar el click de la card.
   */
  async alternarFavorito(event: Event): Promise<void> {
    event.stopPropagation();
    event.preventDefault();

    try {
      if (this.esFavorito) {
        await this.favoritos.quitar('anime', this.anime.mal_id);
        this.esFavorito = false;
      } else {
        await this.favoritos.agregar(
          new Favorito({
            mediaId: this.anime.mal_id,
            type: 'anime',
            title: this.anime.title,
            image: this.anime.images.jpg.large_image_url,
            addedAt: new Date(),
          })
        );
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
    this.cardClick.emit(this.anime);
  }
}
