import { Component, OnInit, inject } from '@angular/core';
import { AdminService } from './../../service/admin.service';
import { CommonModule, JsonPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { swalAlert } from '../swalAlert';
import { swalMessage } from '../swalMessage';
import { swalNotify } from '../swalNotify';
import { AuthService } from '../../service/auth.service';
import { io, Socket } from 'socket.io-client';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule, JsonPipe],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css'],
})
export class UserManagementComponent implements OnInit {
  users: any[] = [];
  filteredUsers: any[] = [];
  regularUsers: any[] = []; // Holds non-admin, non-super-admin users
  adminUsers: any[] = []; // Holds admin users
  superAdminUsers: any[] = []; // Holds super admin users
  searchTerm: string = '';
  isCurrSuperAdmin: boolean = false;
  email: string = '';
  socket: Socket | null = null;

  private adminService = inject(AdminService);
  private authService = inject(AuthService);

  ngOnInit(): void {
    this.authService.currentUser.subscribe((data) => {
      this.isCurrSuperAdmin = !data.isAdmin;
      this.email = data.email;
    });
    this.fetchUsers();

    this.socket = io('http://localhost:4500');
  }

  fetchUsers(): void {
    this.adminService.getAllUsers().subscribe({
      next: (userArray) => {
        this.users = userArray;
        this.filteredUsers = userArray;
        this.updateUserLists();
      },
      error: (error) => {
        console.error('Error fetching users:', error);
      },
    });
  }

  filterUsers(): void {
    this.filteredUsers = this.users.filter(
      (user) =>
        user.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.updateUserLists(); // Update categorized lists
  }

  updateUserLists(): void {
    this.regularUsers = this.filteredUsers.filter(
      (user) => !user.isAdmin && !user.isSuperAdmin
    );
    this.adminUsers = this.filteredUsers.filter(
      (user) => user.isAdmin && !user.isSuperAdmin
    );
    this.superAdminUsers = this.filteredUsers.filter(
      (user) => user.isSuperAdmin
    );
  }

  async toggleAccUser(user: any): Promise<void> {
    const status: string = user.isSuspended ? 'activated' : 'suspended';
    const msg: string = `${user.name}'s account will be ${status}`;
    const res = await swalAlert('question', msg, 'Click Yes to proceed');

    if (res.isConfirmed) {
      this.adminService.suspendUser(user._id).subscribe();
      user.isSuspended = !user.isSuspended;
    }
  }

  async sendMessage(userId: string): Promise<void> {
    const { value: msg, isConfirmed } = await swalMessage();

    if (isConfirmed && msg) {
      this.adminService.notification(userId, msg.message).subscribe({
        next: () => {
          swalNotify('success', 'Message sent successfully');
          this.authService.socket.on('notification', (data) => {
            // console.log(data);
          });
        },
        error: (error) => {
          console.error('Error sending message:', error);
          swalNotify('error', 'Failed to send the message');
        },
      });
    }
  }

  // make and revoke admin functions

  async makeAdmin(user: any): Promise<void> {
    if (user.isSuspended) {
      swalNotify('error', `${user.name} account is Suspended`);
      return;
    }
    const choose = await swalAlert(
      'question',
      'Are you sure ?',
      'user will promote to admin'
    );
    if (!choose.isConfirmed) return;

    this.adminService.makeorRevokeAdmin(this.email, user.email).subscribe({
      next: (res) => console.log(res),
      error: (err) => console.log(err),
    });
    user.isAdmin = true;
    this.updateUserLists();
  }

  async revokeAdmin(user: any): Promise<void> {
    const choose = await swalAlert(
      'question',
      'Are you sure ?',
      'admin privileges will be revoked'
    );

    if (!choose.isConfirmed) return;
    this.adminService.makeorRevokeAdmin(this.email, user.email).subscribe({
      next: (res) => console.log(res),
      error: (err) => console.log(err),
    });

    user.isAdmin = false;
    this.updateUserLists();
  }
}
