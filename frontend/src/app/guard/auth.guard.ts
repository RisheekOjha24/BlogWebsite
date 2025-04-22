import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { swalNotify } from '../components/swalNotify';
 
export const authGuard: CanActivateFn = (route, state) => {
  
  const router=inject(Router);

  const user = localStorage.getItem("user");
  if(!user){
    swalNotify("warning","Please Sign In to continue")
    router.navigateByUrl('/home');
    return false ;
  }
  return true;
};
