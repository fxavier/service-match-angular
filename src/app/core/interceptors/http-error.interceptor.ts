import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '../services/toast.service';

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastService = inject(ToastService);
  
  // In development, simulate random errors (5% chance)
  if (Math.random() < 0.05 && req.url.includes('assets/data')) {
    const error = new HttpErrorResponse({
      error: 'Simulated network error',
      status: 500,
      statusText: 'Internal Server Error'
    });
    
    toastService.showError('Erro de conexão simulado. Tente novamente.');
    return throwError(() => error);
  }
  
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let message = 'Ocorreu um erro inesperado';
      
      switch (error.status) {
        case 0:
          message = 'Erro de conexão. Verifique sua internet.';
          break;
        case 400:
          message = 'Dados inválidos enviados.';
          break;
        case 401:
          message = 'Acesso não autorizado.';
          break;
        case 403:
          message = 'Acesso negado.';
          break;
        case 404:
          message = 'Recurso não encontrado.';
          break;
        case 422:
          message = 'Dados de entrada inválidos.';
          break;
        case 500:
          message = 'Erro interno do servidor.';
          break;
        case 503:
          message = 'Serviço temporariamente indisponível.';
          break;
        default:
          message = `Erro ${error.status}: ${error.statusText || 'Erro desconhecido'}`;
      }
      
      toastService.showError(message);
      
      return throwError(() => error);
    })
  );
};