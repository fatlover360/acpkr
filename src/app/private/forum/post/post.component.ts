import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {AuthService} from '../../../auth/auth.service';
import {MatSnackBar} from '@angular/material';
import {PostService} from '../post.service';
import {Post} from '../../../model/post.model';
import {Game} from '../../../model/game.model';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Comment} from '../../../model/comment.model';


@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {
  id: number;
  post: Post;
  loadingPostDetail = false;
  game: Game = null;
  commentForm: FormGroup = null;
  comment = '';
  comments: Comment [] = [];
  contentVisibility = false;

  constructor(private route: ActivatedRoute, private postService: PostService, private router: Router, public snackBar: MatSnackBar, private auth: AuthService) {
  }

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        this.id = +params['id'];
        this.getPostDetail(this.id);
        this.initForm();
      }
    );
  }

  initForm() {
    this.comment = '';
    this.commentForm = new FormGroup({
      'comment': new FormControl(this.comment, Validators.required)
    });
  }

  onCommentSubmit() {
    this.loadingPostDetail = true;
    const ctnt = this.post.content;
    this.post.content = null;
    const commentToAdd = new Comment(this.commentForm.value['comment'], this.auth.currentUser.uid, new Date(), null, 0, this.auth.currentUser.email, this.post);
    this.postService.saveComment(commentToAdd).subscribe( data => {
      this.snackBar.open('Comment saved', '', {duration: 2000});
      this.post.content = ctnt;
      this.commentForm.reset();
      this.comments.push(commentToAdd);
      this.loadingPostDetail = false;
    });
  }
  getCommentaries(id: number) {
    this.loadingPostDetail = true;
    this.postService.getCommentaries(id).subscribe(data => {
      this.comments = data;
      this.loadingPostDetail = false;
    });
  }

  getPostDetail(id: number) {
    this.loadingPostDetail = true;
    this.postService.getId(id).subscribe(data => {
      this.post = data;
      this.postService.getGame(id).subscribe(game => {
        console.log(game);
        this.game = game;
        this.getCommentaries(id);
      });
    });
  }
  getSmallBlindNumber(number: number) {
    const lastSeat = this.game.seats.length - 1;
    if (number < this.game.seats[lastSeat].number) {
      return number + 1;
    }else {
      return 1;
    }
  }

  edit() {
    this.router.navigate(['../' + this.id + '/edit'], {relativeTo: this.route});
  }

  deletePost() {
    this.postService.delete(this.post).subscribe(data => {
      this.snackBar.open('Post deleted', '', {
        duration: 2000
      });
      this.router.navigate(['../../'], {relativeTo: this.route});
    });
  }

  deleteComment(commentToDelete: Comment) {
    this.postService.deleteCommentary(commentToDelete).subscribe(data => {
      let index = 0;
      this.comments.forEach( c => {
        if (c === commentToDelete) {
          this.comments.slice(index, 1);
          this.snackBar.open('Comment deleted', '', {duration: 2000});
        }
        index++;
      });
    });
  }

  commentsIsMine(commentToCheck: Comment) {
    if (commentToCheck.uid === this.auth.currentUser.uid) {
      return true;
    } else {
      return false;
    }
  }

  postIsMine() {
    if (this.post.uid === this.auth.currentUser.uid) {
      return true;
    } else {
      return false;
    }
  }

  showContent() {
    this.contentVisibility = !this.contentVisibility;
  }

}
