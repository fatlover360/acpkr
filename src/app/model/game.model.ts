import {Seats} from "./seats.model";

export class Game {
  buttonSeat: number;
  flop: string;
  turn: string;
  river: string;
  seats: Seats[];

  constructor(buttonSeat: number, flop: string, turn: string, river: string, seats: Seats[]) {
   this.buttonSeat = buttonSeat;
   this.flop = flop;
   this.turn = turn;
   this.river = river;
   this.seats = seats;
  }

}
