import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { delay, finalize } from 'rxjs';
import { LoadingService } from '../services/loading.service';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);
  
  // Start loading
  loadingService.show();
  
  // Add realistic delay for better UX (300-600ms)
  const delayTime = Math.random() * 300 + 300;
  
  return next(req).pipe(
    delay(delayTime),
    finalize(() => {
      // Hide loading when request completes
      loadingService.hide();
    })
  );
};