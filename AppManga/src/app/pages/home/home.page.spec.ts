import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { vi } from 'vitest';

import { HomePage } from './home.page';
import { AnimeCardComponent } from '../../components/cards/anime-card/anime-card.component';
import { MangaCardComponent } from '../../components/cards/manga-card/manga-card.component';
import { MediaSegmentComponent } from '../../components/media-segment/media-segment.component';
import { PaginationComponent } from '../../components/pagination/pagination.component';
import { MangaModel } from '../../models/manga/manga.model';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      // Replicamos home.module: declara HomePage y todos los componentes
      // custom que usa la plantilla. No importamos ComponentsModule porque
      // ngtsc omite ɵɵsetNgModuleScope (supportJitMode: false) y su scope
      // está vacío en runtime: el TestBed resuelve por declarations, igual
      // que ListCardComponent en favorites.component.spec.
      declarations: [
        HomePage,
        MediaSegmentComponent,
        PaginationComponent,
        MangaCardComponent,
        AnimeCardComponent,
      ],
      // IonicModule además provee ModalController (que inyecta HomePage).
      imports: [IonicModule.forRoot(), RouterTestingModule],
    });

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('navega a la vista de detalle al pulsar un manga', () => {
    const manga = MangaModel.fromJSON({
      mal_id: 21,
      title: 'Monster',
      type: 'Manga',
      status: 'Finished',
      score: 8.8,
      episodes: 0,
      chapters: 18,
      volumes: 3,
      synopsis: 'Historia intensa.',
      images: {
        jpg: { image_url: 'https://example.com/manga.jpg' },
      },
    });

    const navigateSpy = vi.spyOn(router, 'navigate');

    component.onMangaClick(manga);

    expect(navigateSpy).toHaveBeenCalledWith(['/media-detail', 'manga', manga.mal_id], {
      state: { item: manga },
    });
  });
});
