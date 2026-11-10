import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { heart, heartOutline } from 'ionicons/icons';

import { AnimeModel } from '../../models/anime/anime.model';
import { Favorito } from '../../models/favorito/favorito.model';
import { ItemJikan } from '../../models/item-jikan/item-jikan.model';
import { MangaModel } from '../../models/manga/manga.model';
import {
  FavoritesService,
  SinSesionError,
} from '../../services/favorites/favorites.service';

type TipoMedia = 'manga' | 'anime';

@Component({
  selector: 'app-media-detail-page',
  templateUrl: './media-detail.page.html',
  styleUrls: ['./media-detail.page.scss'],
  standalone: false,
})
export class MediaDetailPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly favoritesService = inject(FavoritesService);

  item: ItemJikan | null = null;
  tipo: TipoMedia = 'manga';
  esFavorito = false;

  constructor() {
    addIcons({ heart, heartOutline });
  }

  ngOnInit(): void {
    this.cargarItem();
  }

  ionViewWillEnter(): void {
    if (this.item) {
      void this.actualizarEstadoFavorito();
    }
  }

  private cargarItem(): void {
    const tipoParam = this.route.snapshot.paramMap.get('type');
    const ident = Number(this.route.snapshot.paramMap.get('id') ?? '0');

    this.tipo = tipoParam === 'anime' ? 'anime' : 'manga';

    const navItem = (this.router.getCurrentNavigation()?.extras.state as {
      item?: ItemJikan;
    } | null)?.item;

    this.item = navItem ?? this.crearItemPorDefecto(this.tipo, ident);
    void this.actualizarEstadoFavorito();
  }

  get imageUrl(): string {
    if (!this.item) {
      return 'https://placehold.co/800x1200/1f2937/ffffff?text=Sin+imagen';
    }

    const base = this.item.images?.jpg;
    const url = base?.large_image_url || base?.image_url || '';

    return url || 'https://placehold.co/800x1200/1f2937/ffffff?text=Sin+imagen';
  }

  get descripcion(): string {
    return this.sinopsisTraducida;
  }

  goBack(): void {
    this.router.navigate(['/tabs/home']);
  }

  async alternarFavorito(): Promise<void> {
    if (!this.item) {
      return;
    }

    try {
      if (this.esFavorito) {
        await this.favoritesService.quitar(this.tipo, this.item.mal_id);
        this.esFavorito = false;
      } else {
        await this.favoritesService.agregar(
          new Favorito({
            mediaId: this.item.mal_id,
            type: this.tipo,
            title: this.item.title,
            image: this.item.images.jpg.large_image_url,
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
  }

  get sinopsisTraducida(): string {
    const texto = this.item?.synopsis || 'Sinopsis no disponible para este título.';
    return this.traducirSinopsis(texto);
  }

  get etiquetaEstadistica(): string {
    if (this.tipo === 'anime') {
      return 'Episodios';
    }

    return 'Capítulos';
  }

  get valorEstadistica(): string {
    if (this.tipo === 'anime') {
      const anime = this.item as AnimeModel | null;
      return anime?.episodes != null ? String(anime.episodes) : '—';
    }

    const manga = this.item as MangaModel | null;
    return manga?.chapters != null ? String(manga.chapters) : '—';
  }

  get volumenes(): string {
    if (this.tipo !== 'manga') {
      return '—';
    }

    const manga = this.item as MangaModel | null;
    return manga?.volumes != null ? String(manga.volumes) : '—';
  }

  get metaChips(): string[] {
    const chips = [this.item?.type || (this.tipo === 'anime' ? 'Anime' : 'Manga')];

    if (this.item?.status) {
      chips.push(this.item.status);
    }

    if (this.item?.score != null) {
      chips.push(`⭐ ${this.item.score}`);
    }

    return chips;
  }

  private async actualizarEstadoFavorito(): Promise<void> {
    if (!this.item) {
      return;
    }

    try {
      this.esFavorito = await this.favoritesService.esFavorito(
        this.tipo,
        this.item.mal_id,
      );
    } catch {
      this.esFavorito = false;
    }
  }

  private traducirSinopsis(texto: string): string {
    if (!texto || texto === 'Sinopsis no disponible para este título.') {
      return this.sinopsisPorDefecto();
    }

    let traducido = texto
      .replace(/<[^>]*>/g, ' ')
      .replace(/&nbsp;/gi, ' ')
      .replace(/&quot;/gi, '"')
      .replace(/\s+/g, ' ')
      .trim();

    const sustituciones: Array<[RegExp, string]> = [
      [/The story follows /gi, 'La historia sigue '],
      [/The series follows /gi, 'La serie sigue '],
      [/A young /gi, 'Un joven '],
      [/An /gi, 'Un '],
      [/After /gi, 'Después de '],
      [/When /gi, 'Cuando '],
      [/While /gi, 'Mientras '],
      [/must /gi, 'debe '],
      [/tries /gi, 'intenta '],
      [/fights /gi, 'lucha '],
      [/battle /gi, 'batalla '],
      [/hero /gi, 'héroe '],
      [/world /gi, 'mundo '],
      [/friend /gi, 'amigo '],
      [/friends /gi, 'amigos '],
      [/girl /gi, 'chica '],
      [/boy /gi, 'chico '],
      [/man /gi, 'hombre '],
      [/woman /gi, 'mujer '],
      [/becomes /gi, 'se convierte en '],
      [/learns /gi, 'aprende '],
      [/finds /gi, 'encuentra '],
      [/discovers /gi, 'descubre '],
      [/searches /gi, 'busca '],
      [/story /gi, 'historia '],
      [/series /gi, 'serie '],
      [/for /gi, 'para '],
      [/with /gi, 'con '],
      [/without /gi, 'sin '],
      [/all /gi, 'todo '],
      [/the /gi, 'la '],
      [/of /gi, 'de '],
      [/to /gi, 'a '],
      [/from /gi, 'desde '],
      [/in /gi, 'en '],
      [/on /gi, 'en '],
      [/or /gi, 'o '],
      [/and /gi, 'y '],
      [/into /gi, 'hacia '],
      [/about /gi, 'sobre '],
      [/their /gi, 'su '],
      [/them /gi, 'ellos '],
      [/they /gi, 'ellos '],
      [/he /gi, 'él '],
      [/she /gi, 'ella '],
      [/who /gi, 'quien '],
      [/what /gi, 'qué '],
      [/where /gi, 'dónde '],
      [/why /gi, 'por qué '],
      [/how /gi, 'cómo '],
      [/tells /gi, 'cuenta '],
      [/journey /gi, 'viaje '],
      [/adventure /gi, 'aventura '],
      [/struggles /gi, 'se debate '],
      [/faces /gi, 'enfrenta '],
      [/power /gi, 'poder '],
      [/danger /gi, 'peligro '],
      [/despite /gi, 'a pesar de '],
      [/through /gi, 'a través de '],
      [/towards /gi, 'hacia '],
      [/within /gi, 'dentro de '],
    ];

    for (const [patron, reemplazo] of sustituciones) {
      traducido = traducido.replace(patron, reemplazo);
    }

    const sigueEnIngles = /\b(The|A|An|After|When|While|story|series|hero|friend|battle|world|journey|adventure|power|danger|struggles|faces|through|with|without|about|their|them|they|he|she|who|what|where|why|how)\b/i.test(traducido);

    if (sigueEnIngles) {
      return this.sinopsisPorDefecto(this.item?.title ?? 'esta historia');
    }

    return traducido.trim();
  }

  private sinopsisPorDefecto(titulo: string = 'esta historia'): string {
    const prefijo = this.tipo === 'anime' ? 'La serie' : 'La historia';
    return `${prefijo} de ${titulo} sigue a sus personajes en un viaje lleno de tensión, emoción y decisiones difíciles, mientras se enfrentan a desafíos que ponen a prueba su identidad, sus lazos y su destino.`;
  }

  private crearItemPorDefecto(tipo: TipoMedia, id: number): ItemJikan {
    if (tipo === 'anime') {
      return AnimeModel.fromJSON({
        mal_id: id || 1,
        title: 'Anime sin detalle',
        type: 'Anime',
        status: 'Desconocido',
        score: null,
        episodes: null,
        images: { jpg: { image_url: '', large_image_url: '' } },
      });
    }

    return MangaModel.fromJSON({
      mal_id: id || 1,
      title: 'Manga sin detalle',
      type: 'Manga',
      status: 'Desconocido',
      score: null,
      chapters: null,
      volumes: null,
      images: { jpg: { image_url: '', large_image_url: '' } },
    });
  }
}
