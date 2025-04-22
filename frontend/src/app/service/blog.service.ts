import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  constructor(private http: HttpClient) {}

  private baseUrl = 'http://localhost:4500/api/blog';

  getAllBlogs(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/allBlogs`);
  }

  getBlogById(blogId: { blogId: string }): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/viewBlogs`, blogId);
  }

  getBlogsByEmail(email: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/myBlogs`, { email });
  }

  setBlogApprovalById(blogId: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/setBlogApproval`, { blogId });
  }

  // Send the formData to the backend
  createNewBlog(formData:FormData):Observable<any>{
    return this.http.post<any>(`${this.baseUrl}/newblog`, formData);
  }

  deleteBlogById(blogId:string):Observable<any>{
    return this.http.delete<void>(`${this.baseUrl}/deleteBlog/${blogId}`);
  }

  getBlogInfo(blogId:string){
    return this.http.post<any>(`${this.baseUrl}/getBlogInfo`,{blogId});
  }

  sendLikesToBlog(blogId:string,email:string){
    return this.http.post<any>(`${this.baseUrl}/sendLikesToBlog`,{blogId,email});
  }

  sendComment(blogId:string,email:string,content:string){
    return this.http.post<any>(`${this.baseUrl}/sendComment`,{blogId,email,content});
  }

  delComment(commentId:string){
    return this.http.post<any>(`${this.baseUrl}/deleteComment`,{commentId});
  }

}
