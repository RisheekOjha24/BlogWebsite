import { AuthService } from './../../service/auth.service';
import { CommonModule, DatePipe } from '@angular/common';
import { BlogService } from './../../service/blog.service';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { LottieComponent, AnimationOptions } from 'ngx-lottie';
import { AnimationItem } from 'lottie-web';
import { swalAlert } from '../../components/swalAlert';
import { swalNotify } from '../../components/swalNotify';

@Component({
  selector: 'app-myblogs',
  standalone: true,
  imports: [CommonModule, DatePipe, FormsModule, LottieComponent],
  templateUrl: './myblogs.component.html',
  styleUrls: ['./myblogs.component.css'],
})
export class MyblogsComponent implements OnInit {
  blogs: any[] = [];
  filteredBlogs: any[] = [];
  username: string | null = null;
  email: string | null = null;
  searchTerm: string = '';
  sortBy: string = 'recent';

  options: AnimationOptions = {
    path: 'https://lottie.host/9ef23ea9-e622-4b3a-a79e-b9d16ec7c8de/VnzAQYHWx6.json',
  };

  blogService = inject(BlogService);
  authService = inject(AuthService);
  router = inject(Router);

  ngOnInit(): void {
    const user = localStorage.getItem('user');
    if (user) {
      const userObj = JSON.parse(user);
      this.username = userObj.name;
      this.email = userObj.email;
    }
    
    if(this.email!=null)
    this.fetchBlogsbyEmail(this.email);
  }

  fetchBlogsbyEmail(email:string):void{
       
    if (email) {
      this.blogService.getBlogsByEmail(email).subscribe({
        next: (data) => {
          this.blogs = data;
          this.filteredBlogs = data;
          this.sortBlogs();
          console.log(this.blogs);
        },
        error: (error) => {
          console.error('Error fetching blogs:', error);
        },
      });
    }
  }

  // Buttons View, Edit, Delete

  navigateToView(blogId: string): void {
    this.router.navigateByUrl(`/viewBlog/${blogId}`);
  }

  navigateToEdit(blogId:string):void{
      this.router.navigateByUrl(`/editBlog/${blogId}`);
  }

  async navigateToDelete(blogId:string):Promise<void>{

    const response= await swalAlert('question',"Do you want to delete this blog ?","Click Ok to Proceed");
    
    if(!response.isConfirmed)return;

    this.blogService.deleteBlogById(blogId).subscribe({
      next:(res)=>{
        swalNotify("success",res.msg);
            this.blogs=this.blogs.filter((item)=>(blogId !== item._id));
            this.filteredBlogs=this.blogs;
      },
      error:(err)=>{
        console.log(err);
        swalNotify("error","Some error occured");
      }
    })

  }

  //sorting and filtering code

  filterBlogs(): void {
    this.filteredBlogs = this.blogs.filter((blog) =>
      blog.title.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.sortBlogs(); // Sort after filtering
  }

  sortBlogs(): void {
    if (this.sortBy === 'recent') {
      this.filteredBlogs.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } else {
      this.filteredBlogs.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    }
  }

  animationCreated(animationItem: AnimationItem): void {
     animationItem.setSpeed(2);
  }


}
