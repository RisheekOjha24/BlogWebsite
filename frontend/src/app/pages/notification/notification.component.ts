import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule,FormsModule,DatePipe],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css'
})
export class NotificationComponent implements OnInit{

  notificationData:any[]=[];
  email:string='';

  authService=inject(AuthService);


  ngOnInit(): void {
    this.authService.currentUser.subscribe((user)=>{
      this.email=user.email;
    })

    this.fetchData();

    const user = localStorage.getItem('user');
    if (user) {
      const userObj = JSON.parse(user);
      if(userObj.unreadCount>0){
        userObj.unreadCount=0;
        this.authService.setCurrentUser(userObj);
        localStorage.setItem('user',JSON.stringify(userObj));
      }
    }

    this.authService.sendReadByEmail(this.email).subscribe();
  }

  fetchData():void{
      this.authService.getNotificationByEmail(this.email).subscribe({
        next:(notificationArray)=>{
            this.notificationData=notificationArray;
               this.notificationData = notificationArray.sort(
                 (a:any, b:any) =>
                   new Date(b.date).getTime() - new Date(a.date).getTime()
               );
        },
        error:(err)=>{
          console.log(err);
        }
      })

  }

}
