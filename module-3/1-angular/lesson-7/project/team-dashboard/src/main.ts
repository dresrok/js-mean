import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import localeEs from '@angular/common/locales/es'
import { AppComponent } from './app/app.component';
import { registerLocaleData } from '@angular/common';

registerLocaleData(localeEs)

bootstrapApplication(AppComponent, appConfig).catch(err => console.error(err));
