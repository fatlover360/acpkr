import {Injectable} from '@angular/core';
import {AngularFireAuth} from 'angularfire2/auth';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../../environments/environment.prod';
import {Post} from '../../model/post.model';
import {Observable} from 'rxjs/Observable';
import {Game} from '../../model/game.model';
import {PagepostModel} from '../../model/pagepost.model';
import {Comment} from '../../model/comment.model';

@Injectable()
export class PostService {
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

  savePost(post: Post) {
    return this.http.post(environment.baseUrl + '/posts/add', post, {headers: this.httpOptions.headers} );
  }

  getAll(page: number): Observable<PagepostModel> {
    return this.http.get(environment.baseUrl + '/posts/all?page=' + page).map(data => <PagepostModel> data);
  }

  getId(id: number): Observable<Post> {
    return this.http.get(environment.baseUrl + '/posts/find/' + id).map(data => <Post> data);
  }
  editPost(post: Post) {
    return this.http.patch(environment.baseUrl + '/posts/edit', post, {headers: this.httpOptions.headers});
  }
  delete(post: Post) {
    return this.http.delete(environment.baseUrl + '/posts/delete/' + post.id);
  }

  getGame(id: number): Observable<Game> {
    return this.http.get(environment.baseUrl + '/posts/hand/' + id).map(data => <Game> data);
  }
  saveComment(commnet: Comment) {
    return this.http.post(environment.baseUrl + '/posts/comment/add', commnet, {headers: this.httpOptions.headers});
  }

  getCommentaries(id: number): Observable<Comment []> {
    return this.http.get(environment.baseUrl + '/posts/comments/all/' + id ).map(data => <Comment []> data);
  }

  deleteCommentary(comment: Comment) {
    console.log(comment.id);
    return this.http.delete(environment.baseUrl + '/posts/comment/delete/' + comment.id);
  }
  /*

  getModel(): Observable<Ranges []> {
    return this.http.get(environment.baseUrl + '/range/default').map(data => <Ranges []> data);
  }

  getTypes(): Observable<Type []> {
    return this.http.get(environment.baseUrl + '/range/types/all').map(data => <Type []> data);
  }

  getByTypeAndPosition(type: Type, position: string, blind: string, gametype: string): Observable<Ranges []> {
    return this.http.get(environment.baseUrl + '/range/find/' + type.type + '/' + position + '/' + blind + '/' + gametype).map(data => <Ranges []> data);
  }

  delete(type: Type) {
    return this.http.delete(environment.baseUrl + '/range/delete/' + type.type);
  }

  saveModel(ranges: Ranges []) {
    // const body = JSON.stringify(cash);
    return this.http.post(environment.baseUrl + '/range/model/add', ranges, {headers: this.httpOptions.headers} );
  }

  saveRanges(ranges: Ranges []) {
    // const body = JSON.stringify(cash);
    return this.http.post( environment.baseUrl + '/range/add', ranges, {headers: this.httpOptions.headers} );
  } */

}
