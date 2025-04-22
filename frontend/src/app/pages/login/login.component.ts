import { JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { swalNotify } from '../../components/swalNotify';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, JsonPipe],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {

  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required
    ]),
  });

  formValue: any;

  onLogin(): void {
    this.formValue = this.loginForm.value;

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.login(this.formValue);
  }

  //method receving the reponse of Login API Call
  login(credentials: { email: string; password: string}): void {
    this.authService.login(credentials).subscribe({
      next: (response) => {
        console.log('Login successful:', response);

        // Storing user info in localStorage
        const user = {
          username: response.name,
          email: credentials.email,
          isAdmin: response.isAdmin,
          isSuspended:response.isSuspended,
          unreadCount:response.unreadCount,
          isSuperAdmin:response.isSuperAdmin
        };

        // emitting the username by passing into a function
        this.authService.setCurrentUser(user);
        localStorage.setItem('user', JSON.stringify(user));
        
        if(user.isSuspended)this.router.navigate(['/suspended']);
        else this.router.navigate(['/home']);
      },
      error: (error) => {
        console.log(error);
        const errorMsg =
          error?.error?.msg ||
          'Login failed. Please check your credentials and try again.';
          swalNotify('question', errorMsg, '', 'center');
      },
    });
  }
}
