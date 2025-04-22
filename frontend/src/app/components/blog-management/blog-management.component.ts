import { Component, inject, OnInit } from '@angular/core';
import { BlogService } from '../../service/blog.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { swalAlert } from '../swalAlert';
import { swalNotify } from '../swalNotify';

@Component({
  selector: 'app-blog-management',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './blog-management.component.html',
  styleUrls: ['./blog-management.component.css'],
})
export class BlogManagementComponent implements OnInit {
  blogService = inject(BlogService);
  router=inject(Router);
  blogs: any[] = [];
  filteredBlogs: any[] = [];
  searchTerm: string = '';
  selectedSortOption: string = 'recent';

  ngOnInit(): void {
    this.fetchBlogs();
  }

  fetchBlogs(): void {
    this.blogService.getAllBlogs().subscribe({
      next: (data) => {
        this.blogs = data;
        this.applyFiltersAndSorting(); // Initial display with sorting and filtering
      },
      error: (error) => {
        console.error('Error fetching blogs:', error);
      },
    });
  }

  onSearchChange(): void {
    this.applyFiltersAndSorting(); // Reapply both filters and sorting
  }

  onSortChange(): void {
    this.applyFiltersAndSorting(); // Reapply both filters and sorting
  }

  applyFiltersAndSorting(): void {
    // Filter blogs based on the search term
    const term = this.searchTerm.toLowerCase();
    this.filteredBlogs = this.blogs.filter(
      (blog) =>
        blog.title.toLowerCase().includes(term) ||
        blog.authorName.toLowerCase().includes(term)
    );

    // Sort the filtered blogs based on the selected option
    if (this.selectedSortOption === 'pending') {
      this.filteredBlogs = this.filteredBlogs.filter((blog) => !blog.approved);
    } else if (this.selectedSortOption === 'approved') {
      this.filteredBlogs = this.filteredBlogs.filter((blog) => blog.approved);
    } else if (this.selectedSortOption === 'recent') {
      this.filteredBlogs = this.filteredBlogs.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }
  }

  async approveBlog(blog:any):Promise<any> {
    const response= await swalAlert("question","Sure you want to Approve ?","Blog will be pulished after approval");
    if(!response.isConfirmed)return;
    swalNotify('success',"Blog has been approved");
    blog.approved = true;
    this.blogService.setBlogApprovalById(blog._id).subscribe();
    this.applyFiltersAndSorting();
  }

  async rejectBlog(blog:any):Promise<any>{
    const response = await swalAlert(
      'question',
      'Sure you want to Reject ?',
      'Blog will be removed after rejection'
    );
    if (!response.isConfirmed) return;
    blog.approved = false;
    this.applyFiltersAndSorting();
    swalNotify('success', 'Blog has been rejected');
    this.blogService.setBlogApprovalById(blog._id).subscribe();
  }

  viewBlog(blogId: string): void {
    this.router.navigate([`/viewBlog/${blogId}`]); 
  }

  async deleteBlog(blogId:string):Promise<void>{

    const response= await swalAlert('question',"Do you want to delete this blog ?","Click Ok to Proceed");
    
    if(!response.isConfirmed)return;

    this.blogService.deleteBlogById(blogId).subscribe({
      next:(res)=>{
        swalNotify("success",res.msg);
            this.blogs=this.blogs.filter((item)=>(blogId !== item._id));
            this.applyFiltersAndSorting();
      },
      error:(err)=>{
        console.log(err);
        swalNotify("error","Some error occured");
      }
    })

  }
}
