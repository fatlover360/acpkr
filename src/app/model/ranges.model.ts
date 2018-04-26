export class Ranges {
  value: string;
  type: string;
  percentage: number;
  kind: string;
  position: string;
  blind: string;
  gameType: string;
  color: string;

  constructor(value: string, type: string, percentage: number, kind: string, position: string,  blind: string,
              gameType: string, color: string) {
    this.value = value;
    this.type = type;
    this.percentage = percentage;
    this.kind = kind;
    this.position = position;
    this.blind = blind;
    this.gameType = gameType;
    this.color = color;
  }

}
