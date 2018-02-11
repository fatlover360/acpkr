import {Injectable} from '@angular/core';
import {AngularFireDatabase} from 'angularfire2/database';
import {AuthService} from '../auth/auth.service';

@Injectable()
export class FirabaseDbService {
  authState: any = null;
  constructor(private database: AngularFireDatabase, private authService: AuthService) {
    this.authService.authState.subscribe((auth) => {
      this.authState = auth;
    });
  }

  

}
