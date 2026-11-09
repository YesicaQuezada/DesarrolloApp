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
  firebase: {
    apiKey: 'AIzaSyDAj7VA6dsrfj7ARdPf-D8RzRtvv4403Sc',
    authDomain: 'test-2370.firebaseapp.com',
    projectId: 'test-2370',
    // Obligatorio para Realtime Database: sin esta URL el primer
    // get()/set() falla en el navegador con "Cannot parse Firebase url".
    databaseURL: 'https://test-2370-default-rtdb.firebaseio.com',
    storageBucket: 'test-2370.firebasestorage.app',
    messagingSenderId: '459899072602',
    appId: '1:459899072602:web:a671158a0d04baca096863',
    measurementId: 'G-C4C2PJ0GGN',
  },
};
