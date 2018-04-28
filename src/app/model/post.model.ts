export class Post {
  id: number;
  content: string[];
  date: Date;
  editDate: Date;
  title: string;
  uid: string;
  username: string;
  views: number;

  constructor(id: number, title: string, content: string[], uid: string, date: Date, editDate: Date,  views: number, username: string) {
    this.title = title;
    this.content = content;
    this.uid = uid;
    this.date = date;
    this.editDate = editDate;
    this.views = views;
    this.username = username;
  }

}
