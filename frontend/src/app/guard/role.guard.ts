import { CanActivateFn, Router } from '@angular/router';
import { swalNotify } from '../components/swalNotify';
import { inject } from '@angular/core';

export const roleGuard: CanActivateFn = (route, state) => {

  const router=inject(Router);

  const user = localStorage.getItem("user");
  
  if(user){

    const userData = JSON.parse(user);
    if(userData.isAdmin || userData.isSuperAdmin){
        return true;
    }
    swalNotify("warning","You Don't have Access to this page")

    router.navigateByUrl('/home');
    return false ;
  }

  return false;
};
