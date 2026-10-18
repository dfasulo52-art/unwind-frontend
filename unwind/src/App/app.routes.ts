import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home';
import { AdminComponent } from './components/admin/admin';
import { authGuard } from './services/auth.guard'; // Assicurati che il percorso del file guard sia corretto

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'admin', component: AdminComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '' }
];