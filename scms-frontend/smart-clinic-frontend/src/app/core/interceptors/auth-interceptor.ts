import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');

  const isAuthRequest = req.url.includes('/auth/login') || 
                        req.url.includes('/auth/register') ||
                        req.url.includes('/auth/forgot-password') ||
                        req.url.includes('/auth/reset-password');

  if (token && !isAuthRequest) {
    const cloned = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    return next(cloned);
  }

  return next(req);
};