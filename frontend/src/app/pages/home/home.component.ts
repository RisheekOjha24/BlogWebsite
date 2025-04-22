import { Component, inject, OnInit } from '@angular/core';
import { BlogService } from '../../service/blog.service';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, DatePipe, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  
  blogService = inject(BlogService);
  blogs: any[] = [];
  filteredBlogs: any[] = []; // Array for filtered blogs
  searchTerm: string = ''; // Search term for filtering
  sortBy: string = 'recent'; // Sorting criteria
  private router = inject(Router);

  ngOnInit(): void {
    const user= localStorage.getItem('user');
    if(user)
    {
     const userData=JSON.parse(user);
     if(userData.isSuspended)
      this.router.navigateByUrl('/suspended');
    }
    this.fetchBlogs();
  }

  fetchBlogs(): void {
    this.blogService.getAllBlogs().subscribe({
      next: (data) => {
        this.blogs = data.filter((blog)=>blog.approved===true);
        this.filteredBlogs = this.blogs; // Initialize filtered blogs
        this.sortBlogs();
      },
      error: (error) => {
        console.error('Error fetching blogs:', error);
      },
    });
  }

  filterBlogs(): void {
    this.filteredBlogs = this.blogs.filter(
      (blog) =>
        blog.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        blog.authorName.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.sortBlogs(); // Sort after filtering
  }

  sortBlogs(): void {
  if (this.sortBy === 'oldest'){
      this.filteredBlogs.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    }
    else {
      this.filteredBlogs.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }
  }

  navigateToBlog(blogId: number): void {
    console.log(blogId, 'it is');
    this.router.navigate([`/viewBlog/${blogId}`]);
  }
}