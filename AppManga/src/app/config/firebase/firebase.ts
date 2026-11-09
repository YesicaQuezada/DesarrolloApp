import { initializeApp } from 'firebase/app';

import { environment } from '../../../environments/environment';

// Inicialización de Firebase con la configuración del proyecto test-2370.
// Se importa una sola vez (side effect) desde el servicio de favoritos.
export const firebaseApp = initializeApp(environment.firebase);
