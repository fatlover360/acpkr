import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../auth/auth.service";
import {MatSnackBar} from "@angular/material";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup = null;
  loading = false;
  photo = null;
  user= null;

  constructor(private authService: AuthService, public snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.loading = true;
    setTimeout(s=> {
      this.initForm();
    },2000);
  }

  onCancel() {

  }

  enablePassword() {
    this.authService.sendEmail(this.authService.currentUser.email);
    this.snackBar.open('Email to reset password sent.', '', {duration: 4000});
  }

  initForm() {
    this.user = this.authService.currentUser;
    this.profileForm = new FormGroup({
      'userName': new FormControl(this.authService.currentUser.displayName, Validators.required),
      'email': new FormControl(this.authService.currentUser.email, Validators.required),
      'photoURL': new FormControl(this.authService.currentUser.photoURL, Validators.required),
    });
    this.photo = this.authService.currentUser.photoURL;
    this.loading = false;
  }

  onSubmit() {
    this.authService.updateUserData(this.profileForm.value['userName'], this.profileForm.value['photoURL']);
    this.photo = this.authService.currentUser.photoURL;
    this.snackBar.open('Profile updated.', '', {duration: 4000});
  }




}
