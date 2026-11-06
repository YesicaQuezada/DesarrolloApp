import { HttpInterceptorFn } from '@angular/common/http';

import { environment } from '../../environments/environment';

/**
 * Agrega las credenciales de Cloudflare Access a las llamadas de la API.
 * Un único punto de configuración en lugar de repetir los headers en cada servicio.
 */
export const cfAccessInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.startsWith(environment.apiUrl)) {
    req = req.clone({
      setHeaders: {
        'CF-Access-Client-Id': environment.cfAccessClientId,
        'CF-Access-Client-Secret': environment.cfAccessClientSecret,
      },
    });
  }
  return next(req);
};
