import {Injectable} from '@angular/core';
import {AngularFireAuth} from 'angularfire2/auth';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Ranges} from '../../model/ranges.model';
import {Observable} from "rxjs/Observable";
import {Type} from "../../model/type.model";

@Injectable()
export class RangesService {
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

  getModel(): Observable<Ranges []> {
    return this.http.get('/range/default').map(data => <Ranges []> data);
  }

  getTypes(): Observable<Type []> {
    return this.http.get('/range/types/all').map(data => <Type []> data);
  }

  getByTypeAndPosition(type: Type, position: string, blind: string, gametype: string): Observable<Ranges []> {
    return this.http.get('/range/find/' + type.type + '/' + position + '/' + blind + '/' + gametype).map(data => <Ranges []> data);
  }

  saveType(type: Type) {
    // const body = JSON.stringify(cash);
    return this.http.post('/range/type/add', type, {headers: this.httpOptions.headers} );
  }

  delete(type: Type) {
    return this.http.delete('/range/delete/' + type.type);
  }

  saveModel(ranges: Ranges []) {
    // const body = JSON.stringify(cash);
    return this.http.post('/range/model/add', ranges, {headers: this.httpOptions.headers} );
  }

  saveRanges(ranges: Ranges []) {
    // const body = JSON.stringify(cash);
    return this.http.post('/range/add', ranges, {headers: this.httpOptions.headers} );
  }

}
