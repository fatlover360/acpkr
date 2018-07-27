export class Action {
  amount: number;
  userName: string;
  actionType: string;
  constructor(amount: number, userName: string, actionType: string) {
    this.amount = amount;
    this.userName = userName;
    this.actionType = actionType;
  }
}
