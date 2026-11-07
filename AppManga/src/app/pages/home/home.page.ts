import { Component, OnInit, OnDestroy, ChangeDetectorRef, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { ModalController } from '@ionic/angular';

import { MangaService } from '../../services/api/manga.service';
import { AnimeService } from '../../services/api/anime.service';
import { MangaModel } from '../../models/manga/manga.model';
import { AnimeModel } from '../../models/anime/anime.model';
import { FilterModalComponent } from '../../components/modals/filter-modal/filter-modal.component';
import { FilterSelection } from '../../interfaces/common/filter-selection/filter-selection.interface';

type Segment = 'manga' | 'anime';

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
  private cdr = inject(ChangeDetectorRef);

  segment: Segment = 'manga';

  mangas: MangaModel[] = [];
  mangaPage = 1;
  mangaHasMore = true;
  mangaLoading = false;
  mangaError: string | null = null;
  mangaFilters: FilterSelection = { genreId: null, demographicId: null, status: null };

  animes: AnimeModel[] = [];
  animePage = 1;
  animeHasMore = true;
  animeLoading = false;
  animeError: string | null = null;
  animeFilters: FilterSelection = { genreId: null, demographicId: null, status: null };

  limit = 20;

  private mangaSub?: Subscription;
  private animeSub?: Subscription;

  ngOnInit(): void {
    this.loadMangas();
  }

  ngOnDestroy(): void {
    this.mangaSub?.unsubscribe();
    this.animeSub?.unsubscribe();
  }

  onSegmentChange(value: any): void {
    this.segment = value.detail.value as Segment;
    if (this.segment === 'anime' && this.animes.length === 0 && !this.animeLoading) {
      this.loadAnimes();
    }
    this.cdr.detectChanges();
  }

  // ---------- Mangas ----------
  loadMangas(event?: any): void {
    if (this.mangaLoading || !this.mangaHasMore) {
      event?.target?.complete();
      return;
    }
    this.mangaLoading = true;
    this.mangaError = null;
    this.cdr.detectChanges();

    this.mangaSub?.unsubscribe();
    this.mangaSub = this.mangaService.getMangaList(this.mangaPage, this.limit, this.mangaFilters).subscribe({
      next: (res) => {
        const items = MangaModel.fromJSONArray(res?.data);
        this.mangas = [...this.mangas, ...items];
        this.mangaHasMore = res?.pagination?.has_next_page ?? false;
        this.mangaPage = (res?.pagination?.current_page ?? this.mangaPage) + 1;
      },
      error: (err) => {
        this.mangaError = 'No se pudieron cargar los mangas.';
        this.mangaLoading = false;
        this.cdr.detectChanges();
        event?.target?.complete();
      },
      complete: () => {
        this.mangaLoading = false;
        this.cdr.detectChanges();
        event?.target?.complete();
      },
    });
  }

  retryMangas(): void {
    this.mangaSub?.unsubscribe();
    this.mangaPage = 1;
    this.mangas = [];
    this.mangaHasMore = true;
    this.mangaLoading = false;
    this.mangaError = null;
    this.loadMangas();
  }

  onMangaClick(manga: MangaModel): void {
    console.log('Manga clickeado:', manga.title);
  }

  // ---------- Animes ----------
  loadAnimes(event?: any): void {
    if (this.animeLoading || !this.animeHasMore) {
      event?.target?.complete();
      return;
    }
    this.animeLoading = true;
    this.animeError = null;
    this.cdr.detectChanges();

    this.animeSub?.unsubscribe();
    this.animeSub = this.animeService.getAnimeList(this.animePage, this.limit, this.animeFilters).subscribe({
      next: (res) => {
        const items = AnimeModel.fromJSONArray(res?.data);
        this.animes = [...this.animes, ...items];
        this.animeHasMore = res?.pagination?.has_next_page ?? false;
        this.animePage = (res?.pagination?.current_page ?? this.animePage) + 1;
      },
      error: (err) => {
        this.animeError = 'No se pudieron cargar los animes.';
        this.animeLoading = false;
        this.cdr.detectChanges();
        event?.target?.complete();
      },
      complete: () => {
        this.animeLoading = false;
        this.cdr.detectChanges();
        event?.target?.complete();
      },
    });
  }

  retryAnimes(): void {
    this.animeSub?.unsubscribe();
    this.animePage = 1;
    this.animes = [];
    this.animeHasMore = true;
    this.animeLoading = false;
    this.animeError = null;
    this.loadAnimes();
  }

  onAnimeClick(anime: AnimeModel): void {
    console.log('Anime clickeado:', anime.title);
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
        this.mangaPage = 1;
        this.mangas = [];
        this.mangaHasMore = true;
        this.mangaLoading = false;
        this.loadMangas();
      } else {
        this.animeFilters = data;
        this.animePage = 1;
        this.animes = [];
        this.animeHasMore = true;
        this.animeLoading = false;
        this.loadAnimes();
      }
    }
  }
}
