import {Component, OnInit} from '@angular/core';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {PostService} from '../post.service';
import {Post} from '../../../model/post.model';
import {MatSnackBar} from '@angular/material';
import {AuthService} from '../../../auth/auth.service';

@Component({
  selector: 'app-post-edit',
  templateUrl: './post-edit.component.html',
  styleUrls: ['./post-edit.component.css']
})
export class PostEditComponent implements OnInit {
  id: number;
  editMode = false;
  title = 'New Post';
  postForm: FormGroup = null;
  postTitle = '';
  pokerHouse = '';
  postDescription: string [] = [];
  description = '';
  loadingPost = false;
  postEdit: Post = null;

  constructor(private route: ActivatedRoute, private postService: PostService, private router: Router,  public snackBar: MatSnackBar, private auth: AuthService) {
  }

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        this.id = +params['id'];
        this.editMode = params['id'] != null;
        this.initForm();
      }
    );
    if (this.editMode) {
      this.title = 'Edit Post';
    }
  }

  private initForm() {
    this.loadingPost = true;
    this.postTitle = '';
    this.pokerHouse = '';
    this.postDescription = [];
    if (this.editMode) {
      this.postService.getId(this.id).subscribe(post => {
        this.postTitle = post.title;
        this.postDescription = post.content;
        this.postDescription.forEach( x => {
          this.description = this.description + '\n' + x;
        });
        console.log(this.description);
        this.postEdit = post;
        this.postForm = new FormGroup({
          'title': new FormControl(this.postTitle, Validators.required),
          'description': new FormControl(this.description, Validators.required),
          'pokerhouse': new FormControl(this.pokerHouse, Validators.required)
        });
        this.loadingPost = false;
      });
    }else {
      this.postForm = new FormGroup({
        'title': new FormControl(this.postTitle, Validators.required),
        'description': new FormControl(this.description, Validators.required),
        'pokerhouse': new FormControl(this.pokerHouse, Validators.required)
      });
      this.loadingPost = false;
    }
  }

  onSubmit() {
    const post = new Post(null,
      this.postForm.value['title'],
      this.postForm.value['description'],
      this.auth.currentUser.uid,
      new Date(), null, 0, this.auth.currentUser.email, this.postForm.value['pokerhouse']);

    if (this.editMode) {
      this.postEdit.editDate = new Date();
      this.postEdit.title = this.postForm.value['title'];
      this.postEdit.content = this.postForm.value['description'];
      this.postEdit.pokerHouse = this.postForm.value['pokerhouse'];
      this.postService.editPost(this.postEdit).subscribe( data => {
        this.snackBar.open('Post saved', '', {
          duration: 2000
        });
        this.onCancelEditMode();
      });
    }else {
      this.postService.savePost(post).subscribe( (date: Post) => {
        this.snackBar.open('Post saved', '', {
          duration: 2000
        });
        this.postForm.reset();
        this.onCancel();
      });
    }
  }

  onCancel() {
    if (!this.editMode) {
      this.router.navigate(['../../'], {relativeTo: this.route});
    } else {
      this.onCancelEditMode();
    }
  }
  onCancelEditMode() {
    this.router.navigate(['../'], {relativeTo: this.route});
  }
}
