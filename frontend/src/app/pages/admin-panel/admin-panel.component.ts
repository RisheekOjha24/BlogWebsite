import { Component, inject, OnInit } from '@angular/core';
import { UserManagementComponent } from '../../components/user-management/user-management.component';
import { BlogManagementComponent } from '../../components/blog-management/blog-management.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule,FormsModule,UserManagementComponent,
    BlogManagementComponent
  ],
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.css'
})
export class AdminPanelComponent implements OnInit{
  
  userComponentActive:boolean=true;
  isSuperAdmin:boolean=false;
  authService= inject(AuthService);

  ngOnInit(): void {
    this.authService.currentUser.subscribe((userData)=>{
      this.isSuperAdmin=userData.isSuperAdmin;
    })
  }

  showUserPage():void{
    if(!this.userComponentActive)this.userComponentActive = true;    
  }
}
