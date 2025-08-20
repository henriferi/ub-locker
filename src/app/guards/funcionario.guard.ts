import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';


export const funcionarioGuard: CanActivateFn = () => {
  const router = inject(Router);
  const user = JSON.parse(localStorage.getItem('locker_usuario') || 'null');

  if (user?.IDTIPOUSUARIO === 3) {
    return true;
  }

  router.navigateByUrl('/login');
  return false;
};
