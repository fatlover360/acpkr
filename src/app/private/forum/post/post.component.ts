import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {AuthService} from '../../../auth/auth.service';
import {MatSnackBar} from '@angular/material';
import {PostService} from '../post.service';
import {Post} from '../../../model/post.model';
import {Game} from '../../../model/game.model';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Comment} from '../../../model/comment.model';
import {Seats} from '../../../model/seats.model';


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
  commentForm: FormGroup = null;
  comment = '';
  comments: Comment [] = [];
  contentVisibility = false;
  reseted = false;
  actionPhase: any = 'SHOW_DOWN';
  actionNumberPreFlop = -3;
  actionNumberFlop = -1;
  actionNumberTurn = -2;
  actionNumberRiver = -2;
  actionAnte = false;
  currentPot = 0;
  seatsCurrentAmount: Seats[];

  constructor(private route: ActivatedRoute, private postService: PostService, private router: Router, public snackBar: MatSnackBar, private auth: AuthService) {
  }

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        this.id = +params['id'];
        this.getPostDetail(this.id);
        this.initForm();
      }
    );
  }

  initForm() {
    this.comment = '';
    this.commentForm = new FormGroup({
      'comment': new FormControl(this.comment, Validators.required)
    });
  }

  onCommentSubmit() {
    this.loadingPostDetail = true;
    const ctnt = this.post.content;
    this.post.content = null;
    const commentToAdd = new Comment(this.commentForm.value['comment'], this.auth.currentUser.uid, new Date(), null, 0, this.auth.currentUser.email, this.post);
    this.postService.saveComment(commentToAdd).subscribe(data => {
      this.snackBar.open('Comment saved', '', {duration: 2000});
      this.post.content = ctnt;
      this.commentForm.reset();
      this.comments.push(commentToAdd);
      this.loadingPostDetail = false;
    });
  }

  getCommentaries(id: number) {
    this.loadingPostDetail = true;
    this.postService.getCommentaries(id).subscribe(data => {
      this.comments = data;
      this.loadingPostDetail = false;
    });
  }

  getPostDetail(id: number) {
    this.loadingPostDetail = true;
    this.postService.getId(id).subscribe(data => {
      this.post = data;
      this.postService.getGame(id).subscribe(game => {
        console.log(game);
        this.game = game;
        this.seatsCurrentAmount = game.seats;
        this.seatsCurrentAmount.forEach( seat => seat.chips = 0);
        this.getCommentaries(id);
      });
    });
  }

  getSmallBlindNumber(number: number) {

    const lastSeat = this.game.seats.length - 1;
    if (number < this.game.seats[lastSeat].number) {

      return number + 1;
    } else {

      return 1;
    }
  }

  getBigBlindNumber(small: number) {
    const lastSeat = this.game.seats.length - 1;
    if (small < this.game.seats[lastSeat].number - 1) {
      return small + 1;
    } else {

      return 1;
    }
  }

  getIndex(seatNumber: number) {
    let index = 0;
    for (let i = 0; i < this.game.seats.length; i++) {
      if (this.game.seats[i].number === seatNumber) {
        index = i;
        break;
      }
    }
    return index;
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

  deleteComment(commentToDelete: Comment) {
    this.postService.deleteCommentary(commentToDelete).subscribe(data => {
      let index = 0;
      this.comments.forEach(c => {
        if (c === commentToDelete) {
          this.comments.slice(index, 1);
          this.snackBar.open('Comment deleted', '', {duration: 2000});
        }
        index++;
      });
    });
  }

  commentsIsMine(commentToCheck: Comment) {
    if (commentToCheck.uid === this.auth.currentUser.uid) {
      return true;
    } else {
      return false;
    }
  }

  postIsMine() {
    if (this.post.uid === this.auth.currentUser.uid) {
      return true;
    } else {
      return false;
    }
  }

  isColletor(username: string): boolean {
    let bool = false;
    this.game.showDown.forEach(action => {
      if (action.userName === username && action.actionType === 'COLLECT') {
        bool = true;
      }
    });
    return bool;
  }

  getCollectedAmount(username: string) {
    let amount = 0;
    this.game.showDown.forEach(action => {
      if (action.userName === username && action.actionType === 'COLLECT') {
        amount = action.amount;
      }
    });
    return amount;
  }

  showContent() {
    this.contentVisibility = !this.contentVisibility;
  }

  reset() {
    if (this.reseted === false) {
      this.actionPhase = 'PREFLOP';
      this.reseted = true;
    } else if (this.actionNumberPreFlop > -3) {
      this.reseted = true;
      this.currentPot = 0;
      this.actionNumberPreFlop = -3;
    }
  }

  play() {
    if (this.actionPhase === 'PREFLOP' && this.reseted === true) {
      if (this.actionNumberPreFlop === -3) {
        this.actionAnte = true;
        this.currentPot = this.game.seats.length * this.game.ante;
      } else {
        this.actionAnte = false;
      }
    }
    this.setActionPhase();
  }

  setActionPhase() {
    if (this.actionPhase === 'PREFLOP') {
      this.actionNumberPreFlop++;
    }

    if (this.actionPhase === 'FLOP') {
      this.actionNumberFlop++;
      if (this.game.flopActions != null) {
        if (this.actionNumberFlop >= this.game.flopActions.length) {
          this.actionPhase = 'TURN';
          this.actionNumberPreFlop = -10;
          this.actionNumberFlop = -10;
        }
      } else {
        this.actionPhase = 'SHOW_DOWN';
        this.actionNumberPreFlop = -3;
        this.actionNumberFlop = -1;
        this.actionNumberTurn = -2;
        this.actionNumberRiver = -2;
      }
    }

    if (this.actionPhase === 'TURN') {
      this.actionNumberTurn++;
      if (this.game.turnActions != null) {
        if (this.actionNumberTurn >= this.game.turnActions.length) {
          this.actionPhase = 'RIVER';
          this.actionNumberPreFlop = -10;
          this.actionNumberFlop = -10;
          this.actionNumberTurn = -10;
        }
      } else {
        this.actionPhase = 'SHOW_DOWN';
        this.actionNumberPreFlop = -3;
        this.actionNumberFlop = -1;
        this.actionNumberTurn = -2;
        this.actionNumberRiver = -2;
      }
    }

    if (this.actionPhase === 'RIVER') {
      this.actionNumberRiver++;
      if (this.game.riverActions != null) {
        if (this.actionNumberRiver === this.game.riverActions.length) {
          this.actionPhase = 'SHOW_DOWN';
          this.actionNumberPreFlop = -3;
          this.actionNumberFlop = -1;
          this.actionNumberTurn = -2;
          this.actionNumberRiver = -2;
        }
      } else {
        this.actionPhase = 'SHOW_DOWN';
        this.actionNumberPreFlop = -3;
        this.actionNumberFlop = -1;
        this.actionNumberTurn = -2;
        this.actionNumberRiver = -2;
      }
    }

    if (this.actionNumberPreFlop >= 0) {
      if (this.actionNumberPreFlop < this.game.preFlopActions.length) {
        this.actionPhase = 'PREFLOP';
      } else if ((this.actionNumberPreFlop >= this.game.preFlopActions.length && this.actionNumberPreFlop < (this.game.flopActions.length + this.game.preFlopActions.length))) {
        this.actionPhase = 'FLOP';
        this.actionNumberPreFlop = -10;
      }
    }
  }

  seatMatchWithActionNumber(username: string): boolean {
    let match = false;
    switch (this.actionPhase) {
      case 'PREFLOP':
        if (this.game.preFlopActions[this.actionNumberPreFlop].userName === username) {
          match = true;
        } else {
          for (let x = 0; x < this.actionNumberPreFlop + 1; x++) {
            if (this.game.preFlopActions[x].userName === username) {
              match = true;
            }
          }
        }
        break;
      case 'FLOP':
        if (this.game.flopActions != null) {
          if (this.game.flopActions[this.actionNumberFlop].userName === username) {
            match = true;
          } else {
            for (let x = 0; x < this.actionNumberFlop + 1; x++) {
              if (this.game.flopActions[x].userName === username) {
                match = true;
              }
            }
          }
        }
        break;
      case 'TURN':
        if (this.game.turnActions != null) {
          if (this.game.turnActions[this.actionNumberTurn].userName === username) {
            match = true;
          } else {
            for (let x = 0; x < this.actionNumberTurn + 1; x++) {
              if (this.game.turnActions[x].userName === username) {
                match = true;
              }
            }
          }
        }
        break;
      case 'RIVER':
        if (this.game.riverActions != null) {
          if (this.game.riverActions[this.actionNumberRiver].userName === username) {
            match = true;
          } else {
            for (let x = 0; x < this.actionNumberRiver + 1; x++) {
              if (this.game.riverActions[x].userName === username) {
                match = true;
              }
            }
          }
        }
        break;
      default:
        match = false;
        break;
    }
    return match;
  }

  getAmount(username: string): number {
    let match = 0;
    switch (this.actionPhase) {
      case 'PREFLOP':
        for (let x = 0; x < this.actionNumberPreFlop + 1; x++) {
          if (this.game.preFlopActions[x].userName === username) {
            match = this.game.preFlopActions[x].amount;
          }
        }

        break;
      case 'FLOP':
        for (let k = 0; k < this.actionNumberFlop + 1; k++) {
          if (this.game.flopActions[k].userName === username) {
            match = this.game.flopActions[k].amount;
          }
        }
        break;
      case 'TURN':
        for (let x = 0; x < this.actionNumberTurn + 1; x++) {
          if (this.game.turnActions[x].userName === username) {
            match = this.game.turnActions[x].amount;
          }
        }
        break;
      case 'RIVER':
        for (let x = 0; x < this.actionNumberRiver + 1; x++) {
          if (this.game.riverActions[x].userName === username) {
            match = this.game.riverActions[x].amount;
          }
        }
        break;
      default:
        match = 0;
        break;
    }
    return match;
  }

  getActionType(username: string): string {
    let match = '';
    switch (this.actionPhase) {
      case 'PREFLOP':
        for (let x = 0; x < this.actionNumberPreFlop + 1; x++) {
          if (this.game.preFlopActions[x].userName === username) {
            match = this.game.preFlopActions[x].actionType;
          }
        }
        break;
      case 'FLOP':
        for (let x = 0; x < this.actionNumberFlop + 1; x++) {
          if (this.game.flopActions[x].userName === username) {
            match = this.game.flopActions[x].actionType;
          }
        }
        break;
      case 'TURN':
        for (let x = 0; x < this.actionNumberTurn + 1; x++) {
          if (this.game.turnActions[x].userName === username) {
            match = this.game.turnActions[x].actionType;
          }
        }
        break;
      case 'RIVER':
        for (let x = 0; x < this.actionNumberRiver + 1; x++) {
          if (this.game.riverActions[x].userName === username) {
            match = this.game.riverActions[x].actionType;
          }
        }
        break;
      default:
        match = '';
        break;
    }
    return match;
  }

  /*userIsFolded(username: string) {

  }*/
}
