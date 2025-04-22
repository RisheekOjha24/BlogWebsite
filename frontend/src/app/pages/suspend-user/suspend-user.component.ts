import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-suspend-user',
  standalone: true,
  imports: [],
  templateUrl: './suspend-user.component.html',
  styleUrl: './suspend-user.component.css'
})
export class SuspendUserComponent implements OnInit{

  router=inject(Router);

  ngOnInit(): void {
    const user= localStorage.getItem('user');
    if(user)
    {
     const userData=JSON.parse(user);
     if(!userData.isSuspended) 
      this.router.navigateByUrl('/home');
    
    }else{
      this.router.navigateByUrl('/home');
    }
  }
  
}
