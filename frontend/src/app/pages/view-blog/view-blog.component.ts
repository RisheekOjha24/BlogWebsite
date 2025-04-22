import { Component, ElementRef, inject, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { BlogService } from '../../service/blog.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { Blog } from '../../model/blog.model';
import { AuthService } from '../../service/auth.service';
import { FormsModule } from '@angular/forms';
import { swalNotify } from '../../components/swalNotify';
import { swalAlert } from '../../components/swalAlert';

@Component({
  selector: 'app-view-blog',
  standalone: true,
  imports: [DatePipe,CommonModule,RouterModule,FormsModule],
  templateUrl: './view-blog.component.html',
  styleUrls: ['./view-blog.component.css'],
})
export class ViewBlogComponent implements OnInit {

  @ViewChild('commentBox') slide!:ElementRef;

  blogService = inject(BlogService);
  route = inject(ActivatedRoute);
  private authService = inject(AuthService);
  router=inject(Router);
  
  comments:any[]=[];
  isHideComment:boolean=true;
  blogId:string="";
  content:string="";
  blog: Blog | null = null;
  errorMessage: string = '';
  username: string | null = null;
  email: string  = '';
  isAdmin:boolean=false;
  isSuperAdmin:boolean=false;

  likesCount:number=0;
  isLiked:boolean=false;

 
  ngOnInit() {
    this.blogId= this.route.snapshot.paramMap.get('id')||"";

    this.authService.currentUser.subscribe((data)=>{
      this.email=data.email,
      this.username=data.username
      this.isAdmin=data.isAdmin
      this.isSuperAdmin=data.isSuperAdmin
    })
    this.fetchBlog(this.blogId);
    this.fetchLikes(this.blogId);
  }

  
  fetchBlog(blogId: string) {
    
    this.blogService.getBlogById({blogId}).subscribe({
      next: (blog) => {
        this.blog = blog;
        this.comments = blog.comments
        console.log("cm",this.comments);
      },
      error: (err) => {
        this.errorMessage = err.error?.msg || 'Error loading blog';
        this.router.navigateByUrl('/home');
        console.log(this.errorMessage);
      },
    });
  }

  fetchLikes(blogId:string):void{
    this.blogService.getBlogInfo(blogId).subscribe({
      next:(res)=>{
          console.log(res);
          this.likesCount=res.likesCount;
          
          const emailPreset= res.likedBy.some((obj:any)=>{
            return obj.email === this.email
          })

          this.isLiked=emailPreset;

      },
      error:(err)=>{
        console.log(err);
      }
    })
  }


  toggleLike():void{
   
    if(!this.username && !this.email){
      swalNotify("warning","Dear user, Please Sign In to Continue")
      return;
    }

    this.likesCount= this.isLiked?this.likesCount-1:this.likesCount+1;
    this.isLiked=!this.isLiked;
   
    if(this.email && this.blogId)
      {
        this.blogService.sendLikesToBlog(this.blogId,this.email).subscribe({
          next:(res)=>{
            console.log(res);
          },
          error:(err)=>{
            console.log(err);
          }
      })
    }
  }

  //================== Comment Section =====================================

  scrollToComment():void{
    if(this.slide)
    {
      this.slide.nativeElement.scrollIntoView({ behavior: 'smooth' });    
    }
  }

  toggleComment():void{
    this.isHideComment=!this.isHideComment;
  }

  submitComment():void{

    if(!this.username && !this.email){
      swalNotify("warning","Dear user, Please Sign In to Continue")
      return;
    }

    this.content=this.content.trim();
    if(this.content.length===0)return;
    
    const newComment={authorName:this.username,content:this.content,createdAt:new Date(),authorEmail:this.email};
    
      this.blogService.sendComment(this.blogId,this.email,this.content).subscribe({
        next:(res)=>{
          console.log(res);
          this.fetchBlog(this.blogId);
          },
        error:(err)=>{
          console.log(err);
        }
      })
      this.content="";
  }

  async delComment(commentId:string):Promise<void>{
    const res = await swalAlert("question","Do you want to delete this comment?");
    if(!res.isConfirmed)return;
    this.comments=this.comments.filter((comment)=> comment._id != commentId)
    this.blogService.delComment(commentId).subscribe({
      next:(res)=>{},
      error:(err)=>{console.log(err);}
    });
  }
}
