import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (!token) {
    router.navigate(['/login']);
    return false;
  }

  const url = state.url;
  const adminOnlyPages = ['/dashboard', '/doctors', '/invoices' , '/patients' , '/staff'];
  
  if (adminOnlyPages.some(page => url === page) && role !== 'ADMIN') {
    router.navigate([`/${role?.toLowerCase()}-dashboard`]);
    return false;
  }

  return true;
};