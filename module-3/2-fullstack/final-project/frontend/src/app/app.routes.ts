import { Routes } from '@angular/router';
import { LoginComponent } from './features/login/login.component';
import { LayoutComponent } from './core/components/layout/layout.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'metas',
        loadChildren: () => import('./features/goals/goals.routes').then(m => m.goalRoutes)
      },
      { path: '', redirectTo: 'metas', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: '/login' }
];
