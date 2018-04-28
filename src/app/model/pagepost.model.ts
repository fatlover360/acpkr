import {Post} from "./post.model";

export class PagepostModel {
  content: Post[];
  last: boolean;
  first: boolean;
  totalPages: number;
  totalElements: number;

  constructor(content: Post[], last: boolean, first: boolean, totalPages: number, totalElements: number) {
    this.content = content;
    this.last = last;
    this.first = first;
    this.totalPages = totalPages;
    this.totalElements = totalElements;
  }
}
