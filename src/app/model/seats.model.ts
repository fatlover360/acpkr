export class Seats {
  number: number;
  user: string;
  cardOne: string;
  cardTwo: string;
  chips: number;
  small: boolean;
  big: boolean;
  button: boolean;
  isFold: boolean;

  constructor(number: number, user: string, cardOne: string, cardTwo: string, chips: number, small: boolean,
              big: boolean,
              button: boolean,
              isFold: boolean) {
    this.number = number;
    this.user = user;
    this.cardOne = cardOne;
    this.cardTwo = cardTwo;
    this.chips = chips;
    this.small = small;
    this.big = big;
    this.button = button;
    this.isFold = isFold;
  }
}
