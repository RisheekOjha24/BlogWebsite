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
import { ActivatedRoute, Router } from '@angular/router';
import { swalAlert } from '../../components/swalAlert';
import { BlogService } from '../../service/blog.service';
import { Blog } from '../../model/blog.model';

@Component({
  selector: 'app-create-blog',
  standalone: true,
  imports: [ReactiveFormsModule, QuillModule, CommonModule],
  templateUrl: './edit-blog.component.html',
  styleUrls: ['./edit-blog.component.css'],
})
export class EditBlogComponent implements OnInit {
  
  blog: Blog | null = null;
  blogForm: FormGroup;
  selectedFile: File | null = null;
  imageUrl: string | null = null;
  email: string | null = null;
  userInfo: string | null = null;
  errorMessage: string = '';
  blogId:string='';

  router = inject(Router);
  route = inject(ActivatedRoute);
  blogService=inject(BlogService);

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.blogForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
    });
  }

  fetchBlog(blogId: string) {
    this.blogService.getBlogById({blogId}).subscribe({
      next: (blog) => {
        this.blog = blog;
  
        // Set form controls with fetched blog data
        this.blogForm.patchValue({
          title: blog.title,
          content: blog.content,
        });
  
        // Set the image preview if an image URL exists
        this.imageUrl = blog.imageUrl;
      },
      error: (err) => {
        this.errorMessage = err.error?.msg || 'Error loading blog';
        swalNotify('error',"No Blog Found");
        this.router.navigateByUrl('/home')
        console.error(this.errorMessage);
      },
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

    this.blogId = this.route.snapshot.paramMap.get('id') || "";

    this.fetchBlog(this.blogId);
  }

  onImageUpload(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedFile = file;
      this.imageUrl = URL.createObjectURL(file);
    }
  }

  // Method to remove the existing image
  removeImage(): void {
    this.selectedFile = null; // Clear selected file
    this.imageUrl = null; // Clear image URL
  }

  async onSubmit(): Promise<void> {
    
    const response = await swalAlert('question', 'sure you want to Edit the Blog ?');
    if (!response.isConfirmed) return;

    swalNotify('success', 'Your blog is sent for approval');

    if (this.blogForm.valid) {
      
      const formData: any = new FormData();
      formData.append('title', this.blogForm.get('title')?.value);
      formData.append('content', this.blogForm.get('content')?.value);
      formData.append('blogId', this.blogId);

      if (this.userInfo) {
        const user = JSON.parse(this.userInfo); // Define user as User type
        formData.append('email', user.email); // Set the email from local storage
      } else {
        console.error('User info not found in local storage');
        return;
      }

      if (this.selectedFile) {
        formData.append('image', this.selectedFile);
      }

      this.blogService.createNewBlog(formData).subscribe({
          next: (response) => {
            console.log('Blog submitted successfully', response);
          },
          error: (error) => {
            console.error('Error submitting blog:', error);
          },
        });

      this.clearBlogContent();
      this.router.navigateByUrl('/my-blogs');
    }
  }

  clearBlogContent(): void {
    this.blogForm.reset();
    this.selectedFile = null;
    this.imageUrl = null;
  }
}
