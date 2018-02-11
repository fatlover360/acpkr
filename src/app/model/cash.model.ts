export class Cash {
  amount: number;
  day_number: number;
  month: string;
  year: number;

  constructor(amount: number, day_number: number, month: string, year: number) {
    this.amount = amount;
    this.day_number = day_number;
    this.month = month;
    this.year = year;
  }
}
