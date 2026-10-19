import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
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

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));
