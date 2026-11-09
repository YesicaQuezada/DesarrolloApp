export const environment = {
  production: false,
  apiUrl: '/api', // pasa por el proxy en dev
  cfAccessClientId: 'fdf3e3ba7d7f0bf50fe6686af506fa49.access',
  cfAccessClientSecret:
    'cfast_BK4aXWKV0sFrShwjDK4LaRB8u1TPYg02W8BSxgM2337f5c75',
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
