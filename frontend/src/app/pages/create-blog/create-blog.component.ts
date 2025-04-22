import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { HttpClient } from '@angular/common/http';
import { swalNotify } from '../../components/swalNotify';
import { Router } from '@angular/router';
import { swalAlert } from '../../components/swalAlert';
import { BlogService } from '../../service/blog.service';

@Component({
  selector: 'app-create-blog',
  standalone: true,
  imports: [ReactiveFormsModule, QuillModule, CommonModule],
  templateUrl: './create-blog.component.html',
  styleUrls: ['./create-blog.component.css'],
})
export class CreateBlogComponent implements OnInit {
  blogForm: FormGroup;
  selectedFile: File | null = null;
  imageUrl: string | null = null;
  email: string | null = null;
  userInfo: string | null = null;

  router = inject(Router);
  blogService=inject(BlogService);

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.blogForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.userInfo = localStorage.getItem('user');
    if (this.userInfo) {
      const user = JSON.parse(this.userInfo);
    } else {
      console.log('User info not found in local storage');
      return;
    }
  }

  onImageUpload(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedFile = file;
      this.imageUrl = URL.createObjectURL(file); // Display a preview
    }
  }
  
  removeImage(): void {
    this.selectedFile = null;
    this.imageUrl = null; 
  
    const fileInput = document.getElementById('imageUpload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = ''; 
    }
  }
  
  async onSubmit(): Promise<void> {
    const response = await swalAlert('question', 'sure you want to publish ?');
    if (!response.isConfirmed) return;

    swalNotify('success', 'Your blog is sent for approval');

    if (this.blogForm.valid) {
      const formData: any = new FormData(); // Define formData as any type
      formData.append('title', this.blogForm.get('title')?.value);
      formData.append('content', this.blogForm.get('content')?.value);

      if (this.userInfo) {
        const user = JSON.parse(this.userInfo); // Define user as User type
        formData.append('email', user.email); // Set the email from local storage
      } else {
        console.error('User info not found in local storage');
        return;
      }

      if (this.selectedFile) {
        formData.append('image', this.selectedFile); // Append the selected file
      }

      this.blogService.createNewBlog(formData).subscribe({
          next: (response) => {
            console.log('Blog submitted successfully', response);
            // Handle success response here (e.g., reset form, show a message)
          },
          error: (error) => {
            console.error('Error submitting blog:', error);
            // Handle error response here (e.g., show error message)
          },
        });

      this.clearBlogContent();
    }
  }

  clearBlogContent(): void {
    this.blogForm.reset();
    this.selectedFile = null;
    this.imageUrl = null;
    const fileInput = document.getElementById('imageUpload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = ''; 
    }
  }
}
