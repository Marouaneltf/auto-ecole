import { CanMatchFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const authGuard: CanMatchFn = () => {
  const token = localStorage.getItem('token');
  if (token) return true;
  const router = inject(Router);
  router.navigateByUrl('/admin/login');
  return false;
};
