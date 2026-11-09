import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { provideZoneChangeDetection } from '@angular/core';
import { AppModule } from './app/app.module';

// Inicialización limpia de AWS Cognito antes de que arranque la app
import { Amplify } from 'aws-amplify';
import { environment } from './environments/environment';

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: environment.cognito.userPoolId,
      userPoolClientId: environment.cognito.userPoolClientId
    }
  }
});

// Angular 22 arranca por defecto en modo "zoneless" (sin zone.js): los ticks de
// change detection no se disparaban tras un `await`. Rehabilitamos NgZone/zone.js
// como dice la doc de Angular para apps NgModule (applicationProviders).
platformBrowserDynamic()
  .bootstrapModule(AppModule, {
    applicationProviders: [provideZoneChangeDetection()],
  })
  .catch((err) => console.log(err));
