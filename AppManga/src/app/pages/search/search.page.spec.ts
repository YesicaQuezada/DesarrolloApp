import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { beforeEach, describe, expect, it, spyOn } from 'vitest';

import { SearchPage } from './search.page';
import { FavoritesService } from '../../services/favorites/favorites.service';
import { TipoMedio } from '../../components/media-segment/media-segment.component';
import { ItemJikan } from '../../models/item-jikan/item-jikan.model';

describe('SearchPage', () => {
  let component: SearchPage;
  let fixture: ComponentFixture<SearchPage>;

  /** Resuelve el marcado pendiente de la solapa manga cuando el test lo pida. */
  let resolverMarcadoManga: (marcado: boolean) => void;

  beforeEach(() => {
    TestBed.configureTestingModule({
      // La búsqueda usa la API real: en tests interceptamos HttpClient
      // para no hacer pedidos de red.
      providers: [
        provideHttpClientTesting(),
        {
          provide: FavoritesService,
          useValue: {
            esFavorito: (tipo: TipoMedio) =>
              tipo === 'manga'
                ? new Promise<boolean>((resolver) => {
                    resolverMarcadoManga = resolver;
                  })
                : Promise.resolve(true),
          },
        },
      ],
    });

    fixture = TestBed.createComponent(SearchPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('refresca el estado de favoritos al volver a la vista', async () => {
    component.resultados = [{ mal_id: 42 } as ItemJikan];
    const pagina = component as unknown as {
      marcarFavoritos: () => Promise<void>;
    };

    const spy = spyOn(pagina, 'marcarFavoritos').and.resolveTo();

    component.ionViewWillEnter();

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('un marcado viejo de otra solapa no contamina la actual', async () => {
    // `marcarFavoritos` es privado: lo invocamos por su nombre real para
    // controlar el timing del recorrido sin depender de la red.
    const pagina = component as unknown as {
      marcarFavoritos: () => Promise<void>;
    };
    const unResultado = (malId: number) =>
      [{ mal_id: malId }] as unknown as ItemJikan[];

    // Solapa manga: Monster (mal_id 1) con un marcado lento, pendiente.
    component.tipo = 'manga';
    component.resultados = unResultado(1);
    const marcadoViejo = pagina.marcarFavoritos();

    // El usuario cambia a la solapa anime antes de que termine ese recorrido.
    component.alBuscar({ texto: '', tipo: 'anime' });

    // El recorrido viejo termina tarde y "encuentra" a Monster favorito:
    // sus marcas son de la solapa anterior y no deben publicarse.
    resolverMarcadoManga(true);
    await marcadoViejo;
    expect(component.favoritos.size).toBe(0);

    // El marcado de la solapa actual (Cowboy Bebop, mal_id 1) sí se publica.
    component.resultados = unResultado(1);
    await pagina.marcarFavoritos();
    expect(component.esFavorito(1)).toBe(true);
  });
});
