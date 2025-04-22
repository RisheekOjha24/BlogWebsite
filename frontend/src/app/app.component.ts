import { AuthService } from './service/auth.service';
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { swalAlert } from './components/swalAlert';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'blogWebsite';
  userName: string | null = null;
  email: string | null = null;
  isAdmin: boolean | null = null;
  isSuperAdmin: boolean | null = null;
  isSuspended: boolean | null = null;
  private router = inject(Router);
  private authService = inject(AuthService);
  isSidebarCollapsed = false;
  badgeCount: number = 0;

  isLoginOrRegisterPage(): boolean {
    return this.router.url === '/login' || this.router.url === '/register';
  }

  ngOnInit(): void {
    this.authService.currentUser.subscribe((activeUser) => {
      this.userName = activeUser.username;
      this.email = activeUser.email;
      this.isAdmin = activeUser.isAdmin;
      this.isSuperAdmin = activeUser.isSuperAdmin;
      this.isSuspended = activeUser.isSuspended;
      this.badgeCount = activeUser.unreadCount;
    });
  }

  setBadgeCount(): void {
    this.badgeCount = 0;
  }

  signIn(): void {
    this.router.navigateByUrl('/login');
  }
  async logout(): Promise<void> {
    const result = await swalAlert(
      'warning',
      'Are you sure ?',
      'You will be logged out !'
    );

    if (result.isConfirmed) {
      this.authService.setCurrentUser({
        username: '',
        email: '',
        isAdmin: false,
        isSuspended: false,
        unreadCount: 0,
        isSuperAdmin: false,
      });
      localStorage.clear();
      window.location.href = '/login';
    }
  }
}
