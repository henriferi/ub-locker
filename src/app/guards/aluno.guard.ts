import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';


export const alunoGuard: CanActivateFn = () => {
  const router = inject(Router);
  const user = JSON.parse(localStorage.getItem('locker_usuario') || 'null');

  if (user?.IDTIPOUSUARIO === 4 || user?.IDTIPOUSUARIO === 4) {
    return true;
  }

  router.navigateByUrl('/login');
  return false;
};
