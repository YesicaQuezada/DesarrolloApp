import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PaginationComponent } from './pagination.component';

describe('PaginationComponent', () => {
  let component: PaginationComponent;
  let fixture: ComponentFixture<PaginationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaginationComponent],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(PaginationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('se oculta con una sola página o menos', () => {
    component.totalPaginas = 1;
    expect(component.oculto).toBe(true);

    component.totalPaginas = 0;
    expect(component.oculto).toBe(true);
  });

  it('se muestra con más de una página', () => {
    component.totalPaginas = 3;
    expect(component.oculto).toBe(false);
  });

  it('muestra todas las páginas cuando caben', () => {
    component.totalPaginas = 5;
    expect(component.paginasVisibles()).toEqual([1, 2, 3, 4, 5]);
  });

  it('ventana al principio: primera, vecina y última', () => {
    component.totalPaginas = 20;
    component.paginaActual = 1;
    expect(component.paginasVisibles()).toEqual([1, 2, '…', 20]);
  });

  it('ventana al medio: primera, vecinas y última', () => {
    component.totalPaginas = 20;
    component.paginaActual = 10;
    expect(component.paginasVisibles()).toEqual([1, '…', 9, 10, 11, '…', 20]);
  });

  it('ventana al final: primera, elipsis y las últimas', () => {
    component.totalPaginas = 20;
    component.paginaActual = 20;
    expect(component.paginasVisibles()).toEqual([1, '…', 19, 20]);
  });

  it('no repite la página actual en la ventana', () => {
    component.totalPaginas = 100;
    component.paginaActual = 50;
    const paginas = component.paginasVisibles() as number[];
    const repetidas = paginas.filter((p) => p === 50);
    expect(repetidas.length).toBe(1);
  });

  it('emite cambioPagina al pedir una página', () => {
    component.totalPaginas = 10;
    const emitido: number[] = [];
    component.cambioPagina.subscribe((p: number) => emitido.push(p));

    component.irA(3);

    expect(emitido).toEqual([3]);
  });

  it('no emite si es la página actual', () => {
    component.totalPaginas = 10;
    component.paginaActual = 3;
    const emitido: number[] = [];
    component.cambioPagina.subscribe((p: number) => emitido.push(p));

    component.irA(3);

    expect(emitido).toEqual([]);
  });

  it('recorta el destino a los límites', () => {
    component.totalPaginas = 10;
    // Partimos de una página intermedia: irA solo emite cuando el destino
    // recortado difiere de la actual, así ambos límites son un cambio real.
    component.paginaActual = 5;
    const emitido: number[] = [];
    component.cambioPagina.subscribe((p: number) => emitido.push(p));

    component.irA(0);
    component.irA(99);

    expect(emitido).toEqual([1, 10]);
  });

  it('no pagina mientras carga', () => {
    component.totalPaginas = 10;
    component.cargando = true;
    const emitido: number[] = [];
    component.cambioPagina.subscribe((p: number) => emitido.push(p));

    component.irA(2);

    expect(emitido).toEqual([]);
    expect(component.puedeRetroceder).toBe(false);
    expect(component.puedeAvanzar).toBe(false);
  });
});
