import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {AuthService} from "../../../auth/auth.service";
import {MatSnackBar} from "@angular/material";
import {PostService} from "../post.service";
import {Post} from "../../../model/post.model";
import {Game} from "../../../model/game.model";


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

  constructor(private route: ActivatedRoute, private postService: PostService, private router: Router, public snackBar: MatSnackBar, private auth: AuthService) {
  }

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        this.id = +params['id'];
        this.getPostDetail(this.id);
      }
    );
  }

  getPostDetail(id: number) {
    this.loadingPostDetail = true;
    this.postService.getId(id).subscribe(data => {
      this.post = data;
      this.postService.getGame(id).subscribe(game => {
        console.log(game);
        this.game = game;
        this.loadingPostDetail = false;
      });
    });
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

}
