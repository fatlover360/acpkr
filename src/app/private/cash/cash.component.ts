import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatDialog, MatSnackBar, MatTableDataSource} from '@angular/material';
import {Cash} from '../../model/cash.model';
import {DialogComponent} from '../../utils/dialog/dialog.component';
import {FirebaseDbService} from '../../storage/firebase-db.service';
import {Cashout} from '../../model/cashout.model';
import {Deposit} from '../../model/deposit.model';
import {AngularFireAuth} from "angularfire2/auth";

@Component({
  selector: 'app-cash',
  templateUrl: './cash.component.html',
  styleUrls: ['./cash.component.css']
})
export class CashComponent implements OnInit {
  loading: boolean;
  loadingDeposit: boolean;
  loadingCashout: boolean;
  cash: number;
  months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  CASH_OUT: Cashout[] = [];
  DEPOSIT: Deposit[] = [];
  CASH_DATA: any = [];
  years = [2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025];
  selectedYear = new FormControl(this.years[0]);
  selectedMonth = new FormControl(this.months[new Date().getMonth()]);
  CASH_MONTH: Cash[] = [new Cash(0, 1, this.months[new Date().getMonth()], 2018)];
  displayedColumns = ['day_number', 'amount'];
  displayedColumnsCashout = ['amount', 'date'];
  displayedColumnsDeposit = ['amount', 'date'];
  dataSource = new MatTableDataSource(this.CASH_MONTH);
  dataSourceCashOut = new MatTableDataSource(this.CASH_OUT);
  dataSourceDeposit = new MatTableDataSource(this.DEPOSIT);
  lineChartLegend = false;
  lineChartType = 'line';
  lineChartData: Array<any> = [];
  lineChartLabels: Array<any> = [];
  lineChartOptions: any = {
    responsive: true
  };
  lineChartColors: Array<any> = [
    { // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }];

  constructor(public dialog: MatDialog, public snackBar: MatSnackBar, private db: FirebaseDbService, private auth: AngularFireAuth) {
  }

  setData() {
    this.loading = true;
    this.CASH_DATA = [];
    this.DEPOSIT = [];
    this.lineChartData = [];
    this.lineChartLabels = [];
    this.dataSource.data = [];
    this.dataSourceCashOut.data = [];
    this.dataSourceDeposit.data = [];
    this.db.getCash(this.selectedYear.value, this.selectedMonth.value).subscribe((data) => {
      if (data === null) {
        this.CASH_MONTH = [new Cash(0, 1, this.selectedMonth.value, this.selectedYear.value)];
        this.setValuesEachDay();
        this.setChartX();
        this.setChartY();
        this.setCash();
        this.dataSource.data = this.CASH_MONTH;
        this.setValuesCashProfit();
        this.loading = false;
      } else {
        this.CASH_MONTH = [];
        this.CASH_MONTH = Object.setPrototypeOf(data, Cash.prototype);
        this.setChartX();
        this.setChartY();
        this.dataSource.data = this.CASH_MONTH;
        this.setValuesCashProfit();
        this.loading = false;
      }
      this.setCashout();
      this.setDeposit();
      this.dialog.closeAll();
    });
  }

  setCashout() {
    this.loadingCashout = true;
    this.CASH_OUT = [];
    this.db.getCashout(this.selectedYear.value, this.selectedMonth.value).subscribe((data) => {
      if (data !== null) {
        const ar: string[] = Object.keys(data);
        ar.forEach((id) => {
          this.db.getCashoutObj(this.selectedYear.value, this.selectedMonth.value, id).subscribe((data2) => {
            this.CASH_OUT.push(Object.setPrototypeOf(data2, Cashout.prototype));
            if (ar.indexOf(id) === ar.length - 1) {
              this.loadingCashout = false;
            }
          });
        });
      } else {
        this.loadingCashout = false;
      }
      this.dataSourceCashOut.data = this.CASH_OUT;
    });
  }

  setDeposit() {
    this.loadingDeposit = true;
    this.DEPOSIT = [];
    this.db.getDeposit(this.selectedYear.value, this.selectedMonth.value).subscribe((data) => {
      if (data !== null) {
        const ar: string[] = Object.keys(data);
        ar.forEach((id) => {
          this.db.getDepositObj(this.selectedYear.value, this.selectedMonth.value, id).subscribe((data2) => {
            this.DEPOSIT.push(Object.setPrototypeOf(data2, Deposit.prototype));
            if (ar.indexOf(id) === ar.length - 1) {
              this.loadingDeposit = false;
            }
          });
        });
      } else {
        this.loadingDeposit = false;
      }
      this.dataSourceDeposit.data = this.DEPOSIT;
    });
  }

  ngOnInit() {
    this.loading = true;
    this.openDialog();
    setTimeout(() => {
      this.setData();
    }, 2000);
  }

  setValuesEachDay() {
    while (this.CASH_MONTH.length <= 30) {
      const x = 0;
      const cash = new Cash(x, this.CASH_MONTH.length + 1, this.selectedMonth.value, this.selectedYear.value);
      this.CASH_MONTH.push(cash);
    }
  }

  setChartX() {
    for (let i = 0; i < this.CASH_MONTH.length; i++) {
      this.lineChartLabels.push(this.CASH_MONTH[i].day_number);
    }
  }

  setChartY() {
    for (let i = 0; i < this.CASH_MONTH.length; i++) {
      this.CASH_DATA.push(this.CASH_MONTH[i].amount);
    }
    this.lineChartData.push({data: this.CASH_DATA});
  }

  setCash() {
    this.db.setCash(this.CASH_MONTH).subscribe((data) => {
    }, error2 => console.log(error2));
  }

  getYear() {
    const year = new Date().getFullYear();
    let i = 0;
    this.years.forEach((y) => {
      while (year !== y) {
        i++;
      }
    });
    return i;
  }

  saveAmountCashout() {
    const dialogRefCashout = this.dialog.open(DialogComponent, {
      height: '250px',
      width: '270px',
      disableClose: true,
      data:
        {
          'loading': false,
          'isFromCash': false,
          'isCashOut': true,
          'amountCashout': ''
        }
    });

    dialogRefCashout.afterClosed().subscribe(result => {
      if (result !== undefined) {
        const date = new Date();
        this.db.setCashOut(new Cashout(result, date), this.selectedMonth.value).subscribe(
          (response) => {
            this.CASH_OUT.push(new Cashout(result, date));
            this.dataSourceCashOut.data = this.CASH_OUT;
            this.snackBar.open('Cashout saved', '', {
              duration: 3000
            });
          });
      }
    });
  }

  saveAmountDeposit() {
    const dialogRefDeposit = this.dialog.open(DialogComponent, {
      height: '250px',
      width: '270px',
      disableClose: true,
      data:
        {
          'loading': false,
          'isFromCash': false,
          'isDeposit': true,
          'depositAmount': ''
        }
    });

    dialogRefDeposit.afterClosed().subscribe(result => {
      if (result !== undefined) {
        const date = new Date();
        this.db.setDeposit(new Deposit(result, date), this.selectedMonth.value).subscribe((response) => {
          this.snackBar.open('Deposit saved', '', {
            duration: 3000
          });
          this.DEPOSIT.push(new Deposit(result, date));
          this.dataSourceDeposit.data = this.DEPOSIT;
        });
      }
    });
  }

  saveAmountForDay(cash: Cash) {
    const dialogRefAmountDay = this.dialog.open(DialogComponent, {
      height: '250px',
      width: '270px',
      data:
        {
          cash,
          'loading': false,
          'isFromCash': true
        }
    });

    dialogRefAmountDay.afterClosed().subscribe(result => {
      this.setCash();
      this.snackBar.open('Amount saved', ' ', {
        duration: 3000
      });
     this.setValuesEachDay();
      this.lineChartLabels = [];
      this.lineChartData = [];
      this.CASH_DATA = [];
      this.setChartX();
      this.setChartY();
    });
  }


  setValuesCashProfit() {
    this.cash = 0;
    for (let i = 0; i < this.CASH_MONTH.length; i++) {
      if (this.CASH_MONTH[i].amount > 0) {
        this.cash = this.cash + +this.CASH_MONTH[i].amount;
      }
    }
  }

  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }

  openDialog() {
    const dialogRef = this.dialog.open(DialogComponent, {
      height: '400px',
      width: '400px',
      disableClose: true,
      data: {'loading': true}
    });
  }
}


