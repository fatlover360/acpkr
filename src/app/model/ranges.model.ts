export class Ranges {
  value: string;
  type: string;
  percentage: number;
  kind: string;

  constructor(value: string, type: string, percentage: number, kind: string) {
    this.value = value;
    this.type = type;
    this.percentage = percentage;
    this.kind = kind;
  }

}
