import {Seats} from './seats.model';
import {Action} from './action.model';

export class Game {
  pokerHouse: string;
  seats: Seats[];
  buttonSeat: number;
  flop: string;
  turn: string;
  river: string;
  smallBlind: number;
  bigBlind: number;
  ante: number;
  myHand: string;
  myNick: string;
  preFlopActions: Action[];
  flopActions: Action[];
  turnActions: Action[];
  riverActions: Action[];
  constructor(pokerHouse: string, buttonSeat: number, flop: string, turn: string, river: string, seats: Seats[], smallBlind: number, bigBlind: number
  , ante: number, myHand: string, myNick: string, preFlopActions: Action[], flopActions: Action[], turnActions: Action[], riverActions: Action[]) {
   this.buttonSeat = buttonSeat;
   this.flop = flop;
   this.turn = turn;
   this.river = river;
   this.seats = seats;
    this.smallBlind = smallBlind;
    this.bigBlind = bigBlind;
    this.ante = ante;
    this.myHand = myHand;
    this.myNick = myNick;
    this.preFlopActions = preFlopActions;
    this.turnActions = turnActions;
    this.riverActions = riverActions;
    this.flopActions = flopActions;
    this.pokerHouse = pokerHouse;
  }

}
