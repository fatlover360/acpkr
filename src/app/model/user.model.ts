import {Cash} from './cash.model';
import {Cashout} from './cashout.model';
import {Deposit} from './deposit.model';

export class UserDB {
  name: string;
  startdate: Date;
  cashRecord: Cash[];
  cashoutRecord: Cashout[];
  depositRecord: Deposit[];
  constructor(name: string, startdate: Date, cashRecord: Cash[], cashoutRecord: Cashout[], depositRecord: Deposit[]) {
    this.name = name;
    this.startdate = startdate;
    this.cashRecord = cashRecord;
    this.cashoutRecord = cashoutRecord;
    this.depositRecord = depositRecord;
  }
}
