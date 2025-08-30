import { Routes } from '@angular/router';
import { adminGuard } from '../../core/guards';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('../../layouts/admin-layout/admin-layout.component').then(m => m.AdminLayoutComponent),
    canActivate: [adminGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./admin.component').then(m => m.AdminComponent)
      }
    ]
  }
];