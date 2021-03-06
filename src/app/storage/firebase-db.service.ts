import {Injectable} from '@angular/core';
import {AngularFireAuth} from 'angularfire2/auth';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {UserDB} from '../model/user.model';
import {Cash} from '../model/cash.model';
import {Cashout} from '../model/cashout.model';
import {Deposit} from '../model/deposit.model';
import {environment} from "../../environments/environment.prod";

@Injectable()
export class FirebaseDbService {
  private BASE_PATH = 'https://acpoker-8ccb2.firebaseio.com';
  uid: string;
  user: Object;
  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  };

  constructor(private angFireAuth: AngularFireAuth, private http: HttpClient) {
  }

  createUser() {
    this.uid = this.angFireAuth.auth.currentUser.uid;

    this.getUser(this.uid).subscribe(data => {
      console.log(data);
      if (data === null) {
        const user = {
          date: new Date(),
          uid: this.uid
        };
        this.postFunc(user).subscribe((response) => {
          console.log(response);
        });
      } else {
        this.user = Object.keys(data);
      }
    });
  }

  setUserSubId() {
    this.getUser(this.uid).subscribe(data => {
      this.user = Object.keys(data)[0];
    });
  }

  postFunc(postData: any) {
    const body = JSON.stringify(postData);
    return this.http.post(environment.baseUrl + '/users/add', body, {headers: this.httpOptions.headers});
  }

  getUser(uid: string) {
    return this.http.get( environment.baseUrl + '/users/' + uid);
  }

  getCash(year: string, month: string) {
    return this.http.get(environment.baseUrl +'/users/' + this.angFireAuth.auth.currentUser.uid + '/cash/' + year + '/' + month + '.json');
  }

  setCash(cash: Cash[]) {
    const body = JSON.stringify(cash);
    return this.http.put(environment.baseUrl + '/users/' + this.angFireAuth.auth.currentUser.uid
      + '/cash/' + cash[0].year + '/' +
      cash[0].month + '.json', body,
      {headers: this.httpOptions.headers});
  }

  setCashOut(cashOut: Cashout, month: string) {
    const body = JSON.stringify(cashOut);
    return this.http.post(environment.baseUrl + '/users/' + this.angFireAuth.auth.currentUser.uid
      + '/cash_out/' + cashOut.date.getFullYear() + '/' +
      month + '.json', body,
      {headers: this.httpOptions.headers});
  }

  getCashout(year: string, month: string) {
    return this.http.get(environment.baseUrl + '/users/' + this.angFireAuth.auth.currentUser.uid + '/cash_out/' + year + '/' + month + '.json');
  }

  getCashoutObj(year: string, month: string, id: string) {
    return this.http.get(environment.baseUrl + '/users/' + this.angFireAuth.auth.currentUser.uid
      + '/cash_out/' + year + '/' + month + '/' + id + '.json');
  }

  getDeposit(year: string, month: string) {
    return this.http.get(environment.baseUrl + '/users/' + this.angFireAuth.auth.currentUser.uid + '/deposit/' + year + '/' + month + '.json');
  }

  setDeposit(deposit: Deposit, month: string) {
    const body = JSON.stringify(deposit);
    return this.http.post(environment.baseUrl + '/users/' + this.angFireAuth.auth.currentUser.uid
      + '/deposit/' + deposit.date.getFullYear() + '/' +
      month + '.json', body,
      {headers: this.httpOptions.headers});
  }

  getDepositObj(year: string, month: string, id: string) {
    return this.http.get(environment.baseUrl + '/users/' + this.angFireAuth.auth.currentUser.uid
      + '/deposit/' + year + '/' + month + '/' + id + '.json');
  }

  getUsers() {
    return this.http.get(environment.baseUrl + '/users.json');
  }
}
