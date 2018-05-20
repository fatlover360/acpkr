import {Post} from './post.model';

export class Comment {
  id: number;
  content: string;
  date: Date;
  editDate: Date;
  uid: string;
  username: string;
  likes: number;
  post: Post;

  constructor(content: string, uid: string, date: Date, editDate: Date,  likes: number, username: string, post: Post) {
    this.content = content;
    this.uid = uid;
    this.date = date;
    this.editDate = editDate;
    this.likes = likes;
    this.username = username;
    this.post = post;
  }

}
