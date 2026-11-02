// src/environments/environment.prod.ts
export const environment = {
  production: true,
  apiUrl: 'https://jikan.mecahormiga.dev', // directo en prod (ojo CORS, ver abajo)
  cfAccessClientId: '', // idealmente vacío o inyectado en build
  cfAccessClientSecret: ''
};
