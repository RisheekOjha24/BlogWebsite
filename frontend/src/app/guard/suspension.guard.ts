import { CanActivateFn, Router } from '@angular/router';
import { swalNotify } from '../components/swalNotify';
import { inject } from '@angular/core';

export const suspensionGuard: CanActivateFn = (route, state) => {
  const router=inject(Router);

  const user = localStorage.getItem("user");
  
  if(user){
    const userData = JSON.parse(user);
    if(userData.isSuspended){
      swalNotify("warning","You Don't have Access to this page");
      router.navigateByUrl('/suspended');
      return false;
    }
  }

  return true;
};
