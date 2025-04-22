// blog.model.ts
export interface Blog {
  _id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  imageUrl?: string;
  likesCount: number;
  likedBy: string[]; 
  approved: boolean;
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
}

// Define the structure of a comment
export interface Comment {
  content: string;
  authorId: string;
  authorName: string;
  createdAt: string;
}
