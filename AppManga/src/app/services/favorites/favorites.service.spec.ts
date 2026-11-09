import { TestBed } from '@angular/core/testing';

import { FavoritesService, SinSesionError } from './favorites.service';

describe('FavoritesService', () => {
  let service: FavoritesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FavoritesService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('SinSesionError es un Error con nombre identificable', () => {
    const error = new SinSesionError();
    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe('SinSesionError');
    expect(error.message).toContain('iniciar sesión');
  });

  it('sin sesión de Cognito lanza SinSesionError al listar', async () => {
    // En el entorno de tests no hay sesión de Amplify activa:
    // el servicio debe fallar de forma controlada (la UI lo traduce en "inicia sesión").
    await expect(service.listar('manga')).rejects.toThrow(SinSesionError);
  });
});
