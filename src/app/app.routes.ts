import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login-component/login-component';
import { NovaSenhaComponent } from './pages/nova-senha-component/nova-senha-component';
import { LoginGuard } from './guards/login.guard';
import { AuthGuard } from './guards/auth.guard';
import { DashboardComponent } from './pages/dashboard-component/dashboard-component';

export const routes: Routes = [
  { path: '', component: LoginComponent, canActivate: [LoginGuard] },
  { path: 'nova-senha', component: NovaSenhaComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
