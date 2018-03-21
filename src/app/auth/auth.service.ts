import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {AngularFireAuth} from 'angularfire2/auth';

import {HttpClient} from '@angular/common/http';
import {DialogComponent} from '../utils/dialog/dialog.component';
import {MatDialog} from '@angular/material';


@Injectable()
export class AuthService {
  loading: boolean;
  authState: any = null;

  constructor(private router: Router, public afAuth: AngularFireAuth, private http: HttpClient,
              public dialog: MatDialog) {
    this.afAuth.authState.subscribe((auth) => {
      this.authState = auth;
    });
  }

  signUpUser(email: string, password: string) {
    this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      .then((user) => {
        this.authState = user;
        this.updateUserData();
      })
      .catch(error => console.log(error));
  }

  signInUser(email: string, password: string) {
    this.openDialog();
    this.loading = true;
    this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then((user) => {
        this.authState = user;
        this.router.navigate(['/home']);
        this.dialog.closeAll();
      })
      .catch(error => console.log(error));
  }

  getUserId() {
    return this.http.get('/users/' + this.afAuth.auth.currentUser.uid);
  }

  /*
    //for default
    setImageUrl(userImgUrl: string) {
      if (userImgUrl == null) {
        this.imgUrl = 'https://www.accountingweb.co.uk/sites/all/modules/custom/sm_pp_user_profile/img/default-user.png';
        this.getCurrentUser().updateProfile(
          {
            displayName: "TENHO QUE MUDAR",
            photoURL: this.imgUrl
          });
      } else {
        this.imgUrl = userImgUrl;
      }
    }
    getCurrentUser() {
      return firebase.auth().currentUser;
    }
  */

  signOut(): void {
    this.afAuth.auth.signOut();
    this.openDialog();
    setTimeout(() => {
      this.dialog.closeAll();
      this.router.navigate(['/login']);
    }, 1000);
  }

  getToken() {
    return this.authState.idToken;
  }

  isAuthenticated() {
    return this.currentUser;
  }

  // Returns current user data
  get currentUser(): any {
    return this.authenticated ? this.authState : null;
  }

  get authenticated(): boolean {
    return this.authState !== null;
  }


  // Returns
  get currentUserObservable(): any {
    return this.afAuth.authState;
  }

  // Returns current user UID
  get currentUserId(): string {
    return this.authenticated ? this.authState.uid : '';
  }


  private updateUserData(): void {
    // Writes user name and email to realtime db
    // useful if your app displays information about users or for admin features
    const path = `users/${this.currentUserId}`; // Endpoint on firebase
    const data = {
      email: this.authState.email,
      name: this.authState.displayName
    };
  }

  openDialog() {
    const dialogRef = this.dialog.open(DialogComponent, {
      height: '400px',
      width: '400px',
      disableClose: true,
      data: {'loading': true}
    });
  }
}
