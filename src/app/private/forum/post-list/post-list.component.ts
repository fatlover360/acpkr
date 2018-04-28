import { Component, OnInit } from '@angular/core';
import {PostService} from "../post.service";
import {Post} from "../../../model/post.model";

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit {
  posts: Post [] = [];
  loadingPosts = false;
  totalPages = 0;
  totalElements = 0;
  pageNumber = 0;
  first = false;
  last = false;
  constructor(private postService: PostService) { }

  ngOnInit() {
    this.getAll();
  }

  getAll() {
    this.loadingPosts = true;
    this.postService.getAll(this.pageNumber).subscribe(data => {
      console.log(data);
      this.posts = data.content;
      this.totalPages = data.totalPages;
      this.totalElements = data.totalElements;
      this.first = data.first;
      this.last = data.last;
      this.loadingPosts = false;
    });
  }
  getOlder() {
    this.pageNumber++;
    this.getAll();
  }
  getNewer() {
    this.pageNumber--;
    this.getAll();
  }
}
