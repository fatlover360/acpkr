export class Seats {
  number: number;
  user: string;
  cardOne: string;
  cardTwo: string;
  chips: number;

  constructor(number: number, user: string, cardOne: string, cardTwo: string, chips: number) {
    this.number = number;
    this.user = user;
    this.cardOne = cardOne;
    this.cardTwo = cardTwo;
    this.chips = chips;
  }
}
