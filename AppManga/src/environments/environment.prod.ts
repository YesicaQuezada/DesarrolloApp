// src/environments/environment.prod.ts
export const environment = {
  production: true,
  apiUrl: 'https://jikan.mecahormiga.dev', // directo en prod (ojo CORS, ver abajo)
  cfAccessClientId: '', // idealmente vacío o inyectado en build
  cfAccessClientSecret: '',
  cognito: {
    userPoolId: 'us-east-2_lxyUc9EFU',
    userPoolClientId: '64hhi1t4e6i2ph2mr94stl7ogf',
    region: 'us-east-2',
  },
};