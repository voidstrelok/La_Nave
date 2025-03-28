import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { DISQUS_SHORTNAME } from 'ngx-disqus';


import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes),
    { provide: DISQUS_SHORTNAME, useValue: 'la-nave'}, provideHttpClient()
  ]
};
