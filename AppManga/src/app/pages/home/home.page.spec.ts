import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HomePage } from './home.page';
import { AnimeCardComponent } from '../../components/cards/anime-card/anime-card.component';
import { MangaCardComponent } from '../../components/cards/manga-card/manga-card.component';
import { MediaSegmentComponent } from '../../components/media-segment/media-segment.component';
import { PaginationComponent } from '../../components/pagination/pagination.component';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;

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
      imports: [IonicModule.forRoot()],
    });

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
