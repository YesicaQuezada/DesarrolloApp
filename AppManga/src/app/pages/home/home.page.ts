import { Component, OnInit, OnDestroy, ChangeDetectorRef, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ModalController } from '@ionic/angular';

import { MangaService } from '../../services/api/manga.service';
import { AnimeService } from '../../services/api/anime.service';
import { MangaModel } from '../../models/manga/manga.model';
import { AnimeModel } from '../../models/anime/anime.model';
import { FilterModalComponent } from '../../components/modals/filter-modal/filter-modal.component';
import { FilterSelection } from '../../interfaces/common/filter-selection/filter-selection.interface';
import { TipoMedio } from '../../components/media-segment/media-segment.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit, OnDestroy {
  private mangaService = inject(MangaService);
  private animeService = inject(AnimeService);
  private modalCtrl = inject(ModalController);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  segment: TipoMedio = 'manga';

  mangas: MangaModel[] = [];
  mangaPage = 1;
  mangaTotalPaginas = 1;
  mangaHasNextPage = false;
  mangaLoading = false;
  mangaError: string | null = null;
  mangaFilters: FilterSelection = { genreId: null, demographicId: null, status: null };

  animes: AnimeModel[] = [];
  animePage = 1;
  animeTotalPaginas = 1;
  animeHasNextPage = false;
  animeLoading = false;
  animeError: string | null = null;
  animeFilters: FilterSelection = { genreId: null, demographicId: null, status: null };

  limit = 20;

  private mangaSub?: Subscription;
  private animeSub?: Subscription;

  ngOnInit(): void {
    this.loadMangas(1);
  }

  ngOnDestroy(): void {
    this.mangaSub?.unsubscribe();
    this.animeSub?.unsubscribe();
  }

  onSegmentChange(valor: TipoMedio): void {
    this.segment = valor;
    if (this.segment === 'anime' && this.animes.length === 0 && !this.animeLoading) {
      this.loadAnimes(1);
    }
    this.cdr.detectChanges();
  }

  // ---------- Mangas ----------
  /**
   * @function loadMangas
   * @description Carga una página concreta de mangas. Si `append` es true,
   * acumula la página nueva al final de la lista para que funcione el infinite scroll.
   */
  loadMangas(page: number, append = false): void {
    if (this.mangaLoading) return;
    this.mangaPage = page;
    this.mangaLoading = true;
    this.mangaError = null;
    this.cdr.detectChanges();

    this.mangaSub?.unsubscribe();
    this.mangaSub = this.mangaService.getMangaList(page, this.limit, this.mangaFilters).subscribe({
      next: (res) => {
        const nuevos = MangaModel.fromJSONArray(res?.data ?? []);
        this.mangas = append ? [...this.mangas, ...nuevos] : nuevos;
        this.mangaTotalPaginas = Math.max(res?.pagination?.last_visible_page ?? 1, 1);
        this.mangaHasNextPage = Boolean(res?.pagination?.has_next_page);
      },
      error: () => {
        this.mangaError = 'No se pudieron cargar los mangas.';
        this.mangaLoading = false;
        this.cdr.detectChanges();
      },
      complete: () => {
        this.mangaLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  cambiarPaginaManga(page: number): void {
    this.mangas = [];
    this.loadMangas(page, false);
  }

  loadMoreMangas(event?: any): void {
    if (!this.mangaHasNextPage || this.mangaLoading) {
      event?.target?.complete?.();
      return;
    }

    const nextPage = this.mangaPage + 1;
    this.loadMangas(nextPage, true);
    event?.target?.complete?.();
  }

  retryMangas(): void {
    this.mangaSub?.unsubscribe();
    this.mangas = [];
    this.mangaTotalPaginas = 1;
    this.mangaLoading = false;
    this.mangaError = null;
    this.loadMangas(1);
  }

  onMangaClick(manga: MangaModel): void {
    this.router.navigate(['/media-detail', 'manga', manga.mal_id], {
      state: { item: manga },
    });
  }

  // ---------- Animes ----------
  /** @function loadAnimes - Igual que loadMangas pero para el medio anime. */
  loadAnimes(page: number, append = false): void {
    if (this.animeLoading) return;
    this.animePage = page;
    this.animeLoading = true;
    this.animeError = null;
    this.cdr.detectChanges();

    this.animeSub?.unsubscribe();
    this.animeSub = this.animeService.getAnimeList(page, this.limit, this.animeFilters).subscribe({
      next: (res) => {
        const nuevos = AnimeModel.fromJSONArray(res?.data ?? []);
        this.animes = append ? [...this.animes, ...nuevos] : nuevos;
        this.animeTotalPaginas = Math.max(res?.pagination?.last_visible_page ?? 1, 1);
        this.animeHasNextPage = Boolean(res?.pagination?.has_next_page);
      },
      error: () => {
        this.animeError = 'No se pudieron cargar los animes.';
        this.animeLoading = false;
        this.cdr.detectChanges();
      },
      complete: () => {
        this.animeLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  cambiarPaginaAnime(page: number): void {
    this.animes = [];
    this.loadAnimes(page, false);
  }

  loadMoreAnimes(event?: any): void {
    if (!this.animeHasNextPage || this.animeLoading) {
      event?.target?.complete?.();
      return;
    }

    const nextPage = this.animePage + 1;
    this.loadAnimes(nextPage, true);
    event?.target?.complete?.();
  }

  retryAnimes(): void {
    this.animeSub?.unsubscribe();
    this.animes = [];
    this.animeTotalPaginas = 1;
    this.animeLoading = false;
    this.animeError = null;
    this.loadAnimes(1);
  }

  onAnimeClick(anime: AnimeModel): void {
    this.router.navigate(['/media-detail', 'anime', anime.mal_id], {
      state: { item: anime },
    });
  }

  // ---------- Filtros ----------
  async openFilterModal(): Promise<void> {
    const isManga = this.segment === 'manga';
    const modal = await this.modalCtrl.create({
      component: FilterModalComponent,
      componentProps: {
        type: this.segment,
        currentFilters: isManga ? this.mangaFilters : this.animeFilters,
      },
    });
    await modal.present();

    const { data, role } = await modal.onWillDismiss();
    if (role === 'apply' && data) {
      if (isManga) {
        this.mangaFilters = data;
        this.mangas = [];
        this.mangaTotalPaginas = 1;
        this.mangaLoading = false;
        this.loadMangas(1);
      } else {
        this.animeFilters = data;
        this.animes = [];
        this.animeTotalPaginas = 1;
        this.animeLoading = false;
        this.loadAnimes(1);
      }
    }
  }
}
