import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const toastService = inject(ToastService);
  
  if (!authService.isAuthenticated()) {
    router.navigate(['/auth/login'], {
      queryParams: { returnUrl: state.url }
    });
    return false;
  }
  
  const userRole = authService.userRole();
  if (userRole !== 'admin') {
    toastService.showError('Acesso negado. Apenas administradores podem acessar esta página.');
    router.navigate(['/']);
    return false;
  }
  
  return true;
};