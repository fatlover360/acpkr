import {Component, OnInit, ViewChild} from '@angular/core';

import {MatDialog, MatSnackBar} from '@angular/material';
import {AngularFireAuth} from 'angularfire2/auth';
import {CalendarComponent} from 'ng-fullcalendar';
import {Options} from 'fullcalendar';
import {DialogComponent} from '../../utils/dialog/dialog.component';
import {AuthService} from '../../auth/auth.service';
import {CashService} from './cash.service';
import {EventCash} from '../../model/eventcash.model';


@Component({
  selector: 'app-cash',
  templateUrl: './cash.component.html',
  styleUrls: ['./cash.component.css']
})
export class CashComponent implements OnInit {
  loading = false;
  calendarOptions: Options;
  userId: any;
  cash: any;
  eventCash: EventCash[] = [];
  @ViewChild(CalendarComponent) ucCalendar: CalendarComponent;

  constructor(private cashService: CashService, public dialog: MatDialog, public snackBar: MatSnackBar, private auth: AngularFireAuth, private authService: AuthService) {
  }

  ngOnInit() {
    this.authService.getUserId().subscribe((data) => {
      this.userId = data;
    });

    this.loading = true;
    // this.openDialog();
    setTimeout(() => {// this.setData();
    }, 2000);
    this.getCash();
  }

  getCash() {
    this.cashService.getCash().subscribe((data) => {
      this.cash = data;
      this.cash.forEach((elem) => {
        this.eventCash.push(new EventCash('CASH:' + elem.amount, elem.date, elem.date));
      });

      this.calendarOptions = {
        editable: true,
        eventLimit: true,
        header: {
          left: 'prev,next today',
          center: 'title',
          right: 'month'
        },
        selectable: true,
        events: this.eventCash
      };
    });
  }

  dayClick(model: any) {
    // console.log(model);
    let empty = true;
    let amountEvent = '';
    this.eventCash.forEach((elem) => {
      if (elem.start === model.date._i) {
        empty = false;
        amountEvent = elem.title.split(':')[1];
      }
    });

    const dialogRefCash = this.dialog.open(DialogComponent, {
      height: '250px',
      width: '270px',
      disableClose: false,
      data:
        {
          'loading': false,
          'isFromCash': true,
          'isCashOut': false,
          'add': empty,
          'amount': !empty ? amountEvent : ''
        }
    });
    dialogRefCash.afterClosed().subscribe(result => {
      if (result !== undefined) {
        console.log(result.add);
      }
      /*  const cash = {
          amount: result,
          date: model.date._i,
          user: this.userId
        };
        console.log(cash);
        this.cashService.saveCash(cash).subscribe(() => {
          this.snackBar.open('Cash saved', '', {
            duration: 3000
          });
        });
      }*/
    });
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
        /* this.db.setCashOut(new Cashout(result, date), this.selectedMonth.value).subscribe(
           (response) => {
             this.CASH_OUT.push(new Cashout(result, date));
             this.dataSourceCashOut.data = this.CASH_OUT;
             this.snackBar.open('Cashout saved', '', {
               duration: 3000
             });
           });*/
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
        /* this.db.setDeposit(new Deposit(result, date), this.selectedMonth.value).subscribe((response) => {
           this.snackBar.open('Deposit saved', '', {
             duration: 3000
           });
           this.DEPOSIT.push(new Deposit(result, date));
           this.dataSourceDeposit.data = this.DEPOSIT;
         });*/
      }
    });
  }

  saveAmountForDay(model: any) {
    /* const dialogRefAmountDay = this.dialog.open(DialogComponent, {
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
     });*/
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


