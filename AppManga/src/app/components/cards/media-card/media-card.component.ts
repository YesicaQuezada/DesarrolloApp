import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import { addIcons } from 'ionicons';
import { heart, heartOutline } from 'ionicons/icons';

import { AnimeModel } from '../../../models/anime/anime.model';
import { Favorito } from '../../../models/favorito/favorito.model';
import { MangaModel } from '../../../models/manga/manga.model';
import {
  FavoritesService,
  SinSesionError,
} from '../../../services/favorites/favorites.service';

@Component({
  selector: 'app-media-card',
  templateUrl: './media-card.component.html',
  styleUrls: ['./media-card.component.scss'],
  standalone: false,
})
export class MediaCardComponent implements OnInit {
  @Input() media!: AnimeModel | MangaModel;
  @Input() type: 'anime' | 'manga' = 'anime';
  @Output() cardClick = new EventEmitter<AnimeModel | MangaModel>();

  private readonly favoritos = inject(FavoritesService);
  private readonly cdr = inject(ChangeDetectorRef);

  esFavorito = false;

  constructor() {
    addIcons({ heart, heartOutline });
  }

  ngOnInit(): void {
    this.favoritos
      .esFavorito(this.type, this.media.mal_id)
      .then((ok) => {
        this.esFavorito = ok;
        this.cdr.markForCheck();
      })
      .catch(() => {
        // Sin sesión o sin red: se queda sin marcar.
      });
  }

  get imageUrl(): string {
    return this.media.images?.jpg?.large_image_url || this.media.images?.jpg?.image_url || '';
  }

  async alternarFavorito(event: Event): Promise<void> {
    event.stopPropagation();
    event.preventDefault();

    try {
      if (this.esFavorito) {
        await this.favoritos.quitar(this.type, this.media.mal_id);
        this.esFavorito = false;
      } else {
        await this.favoritos.agregar(
          new Favorito({
            mediaId: this.media.mal_id,
            type: this.type,
            title: this.media.title,
            image: this.imageUrl,
            addedAt: new Date(),
          }),
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

    this.cdr.markForCheck();
  }

  onClick(): void {
    this.cardClick.emit(this.media);
  }
}
