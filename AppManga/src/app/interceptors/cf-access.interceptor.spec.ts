import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { cfAccessInterceptor } from './cf-access.interceptor';
import { environment } from '../../environments/environment';

describe('cfAccessInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([cfAccessInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('agrega las credenciales CF Access a las llamadas de la API', () => {
    http.get('/api/v4/manga').subscribe();

    const req = httpMock.expectOne('/api/v4/manga');
    expect(req.request.headers.get('CF-Access-Client-Id')).toBe(
      environment.cfAccessClientId
    );
    expect(req.request.headers.get('CF-Access-Client-Secret')).toBe(
      environment.cfAccessClientSecret
    );
    req.flush({ data: [] });
  });

  it('no agrega credenciales a URLs que no son de la API', () => {
    http.get('https://ejemplo.com/otra').subscribe();

    const req = httpMock.expectOne('https://ejemplo.com/otra');
    expect(req.request.headers.has('CF-Access-Client-Id')).toBeFalsy();
    expect(req.request.headers.has('CF-Access-Client-Secret')).toBeFalsy();
    req.flush({});
  });
});
