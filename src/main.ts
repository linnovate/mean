import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { EventEmitter } from 'events';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

(window as any).global = window;
(window as any).globalEvents = new EventEmitter();

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch(err => console.log(err));
