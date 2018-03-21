import {Injectable} from '@angular/core';
import {AngularFireAuth} from 'angularfire2/auth';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable()
export class CashService {
  loading: boolean;
  authState: any = null;
  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  };

  constructor(public afAuth: AngularFireAuth, private http: HttpClient) {
    this.afAuth.authState.subscribe((auth) => {
      this.authState = auth;
    });
  }

  getCash() {
    return this.http.get('/cash/find/' + this.afAuth.auth.currentUser.uid);
  }

  saveCash(cash: any) {
   // const body = JSON.stringify(cash);
    return this.http.post('/cash/add', cash, {headers: this.httpOptions.headers} );
  }

}
