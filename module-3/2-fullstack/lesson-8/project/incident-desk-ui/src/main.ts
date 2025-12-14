import { bootstrapApplication } from '@angular/platform-browser';

import { appConfig } from './app/app.config';
import { App } from './app/app';

// Punto de entrada principal de la aplicación que inicia el componente raíz.
bootstrapApplication(App, appConfig).catch((err) =>
  console.error('Error al iniciar la aplicación', err)
);
