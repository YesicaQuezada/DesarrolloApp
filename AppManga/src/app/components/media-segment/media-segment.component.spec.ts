import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, SegmentChangeEventDetail } from '@ionic/angular';

import { MediaSegmentComponent } from './media-segment.component';

/** Simula el evento `ionChange` que emite `ion-segment`. */
function eventoSegmento(valor: string | number | undefined): CustomEvent<SegmentChangeEventDetail> {
  return { detail: { value: valor } } as CustomEvent<SegmentChangeEventDetail>;
}

describe('MediaSegmentComponent', () => {
  let component: MediaSegmentComponent;
  let fixture: ComponentFixture<MediaSegmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MediaSegmentComponent],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(MediaSegmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('arranca en manga (estándar compartido con Home)', () => {
    expect(component.valor).toBe('manga');
  });

  it('emite valorChange al cambiar a anime', () => {
    const emitido: string[] = [];
    component.valorChange.subscribe((v: string) => emitido.push(v));

    component.cambiar(eventoSegmento('anime'));

    expect(emitido).toEqual(['anime']);
  });

  it('emite valorChange al volver a manga', () => {
    const emitido: string[] = [];
    component.valorChange.subscribe((v: string) => emitido.push(v));

    component.cambiar(eventoSegmento('manga'));

    expect(emitido).toEqual(['manga']);
  });

  it('ignora valores fuera de manga|anime (no contamina el estado)', () => {
    const emitido: string[] = [];
    component.valorChange.subscribe((v: string) => emitido.push(v));

    component.cambiar(eventoSegmento('pelicula'));
    component.cambiar(eventoSegmento(undefined));

    expect(emitido).toEqual([]);
  });

  it('no muta su propio input: queda controlado por el padre', () => {
    component.cambiar(eventoSegmento('anime'));
    expect(component.valor).toBe('manga');
  });
});
