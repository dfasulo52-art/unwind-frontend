import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './App/app.config';
import { app } from './App/app';

bootstrapApplication(app, appConfig)
  .catch((err) => console.error(err));