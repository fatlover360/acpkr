import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import {AuthService} from '../../auth/auth.service';
import {MatDialog} from "@angular/material";
import {DialogComponent} from "../../utils/dialog/dialog.component";
import {AngularFireDatabase} from "angularfire2/database";
import {FirebaseDbService} from "../../storage/firebase-db.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  emailControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);
  passwordControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  matcher = new MyErrorStateMatcher();

  constructor(private authService: AuthService, private firebaseService: FirebaseDbService) { }

  ngOnInit() {
  }

  onSingIn() {
    console.log(this.emailControl);
    console.log(this.passwordControl);
    this.authService.signInUser(this.emailControl.value, this.passwordControl.value);
    setTimeout(() => {
      this.firebaseService.createUser();
    }, 1000);
  }
}

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
