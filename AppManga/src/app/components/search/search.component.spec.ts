import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { SearchComponent } from './search.component';
import { MediaSegmentComponent } from '../media-segment/media-segment.component';

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      // Replicamos search.module: declara SearchComponent y el segmento
      // que usa la plantilla. No importamos ComponentsModule porque ngtsc
      // omite ɵɵsetNgModuleScope (supportJitMode: false) y su scope está
      // vacío en runtime: el TestBed resuelve por declarations, igual que
      // ListCardComponent en favorites.component.spec.
      declarations: [SearchComponent, MediaSegmentComponent],
      imports: [FormsModule, IonicModule.forRoot()],
    });

    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
