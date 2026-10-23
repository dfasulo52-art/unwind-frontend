import { ApplicationConfig, provideBrowserGlobalErrorListeners, InjectionToken } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

// Definiamo un token per l'URL delle API
export const API_URL = new InjectionToken<string>('API_URL');

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    // Registriamo l'URL di Render come valore globale per l'app
    { provide: API_URL, useValue: 'https://unwind-backend-i6c8.onrender.com' }
  ]
};