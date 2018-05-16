export class Action {
  betAmount: number;
  userName: string;
  actionType: string;

  constructor(betAmount: number, userName: string, actionType: string) {
    this.betAmount = betAmount;
    this.userName = userName;
    this.actionType = actionType;
  }

}
