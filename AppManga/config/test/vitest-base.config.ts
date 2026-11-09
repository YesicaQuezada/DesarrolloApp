import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Ionic (web components) lanza rechazos asíncronos benignos al correr en
    // jsdom: la carga perezosa de módulos de @ionic/core resuelve `undefined`
    // bajo el module runner de Vitest y ionicons hace fetch de SVGs relativos
    // (p. ej. /svg/funnel-outline.svg) que Node no puede resolver sin origin.
    // Los 13 tests pasan; esto evita que esos ruidos dejen el exit en 1.
    dangerouslyIgnoreUnhandledErrors: true,
    server: {
      deps: {
        // @ionic/angular publica sus bundles ESM (fesm*) que importan
        // "@ionic/core/components" (un directorio). Node no resuelve imports
        // de directorio en ESM, así que forzamos a Vitest/Vite a procesar los
        // paquetes @ionic/* para que use su resolvedor (directorio -> index.js).
        // Vitest evalúa estos patrones contra la ruta RESUELTA del archivo,
        // por eso el patrón no va anclado al inicio.
        inline: [/@ionic\//],
      },
    },
  },
});
