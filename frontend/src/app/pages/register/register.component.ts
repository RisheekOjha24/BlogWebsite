import { CommonModule, JsonPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { swalNotify } from '../../components/swalNotify';
import { passwordValidator } from '../../components/customValidator';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, JsonPipe,CommonModule,MatIconModule],
  templateUrl: 'register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  userForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(4)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      passwordValidator(),
    ]),
    confirmPassword: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
  });

  // Properties to track password criteria
  isUppercaseValid: boolean = false;
  isLowercaseValid: boolean = false;
  isNumberValid: boolean = false;
  isSpecialCharValid: boolean = false;

  ngOnInit(): void {
    this.userForm.get('password')?.valueChanges.subscribe((value) => {
      this.checkPasswordCriteria(value);
    });
  }

  checkPasswordCriteria(password: string): void {
    this.isUppercaseValid = /[A-Z]/.test(password);
    this.isLowercaseValid = /[a-z]/.test(password);
    this.isNumberValid = /\d/.test(password);
    this.isSpecialCharValid = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  }

  onSubmit(): void {
    const formValue = this.userForm.value;
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }
    if (formValue.password !== formValue.confirmPassword) {
      return;
    }
    this.register(formValue);
  }

  register(user: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  }): void {
    this.authService.register(user).subscribe({
      next: (response) => {
        swalNotify('success', 'Registration successful!');
        this.router.navigate(['/login']);
      },
      error: (error) => {
        const errorMsg =
          error?.error?.msg || 'Registration failed. Please try again.';
        swalNotify('error', errorMsg);
      },
    });
  }

  passwordsDoNotMatch(): boolean {
    return this.userForm.value.password !== this.userForm.value.confirmPassword;
  }
}
