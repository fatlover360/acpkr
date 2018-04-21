import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Cash} from "../../model/cash.model";

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {
  loading: boolean;
  cash: boolean;
  isCashOut: boolean;
  isDeposit: boolean;
  empty: boolean;
  types: boolean;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<DialogComponent>) { }

  ngOnInit() {
    this.loading = this.data.loading;
    this.cash = this.data.isFromCash;
    this.isCashOut = this.data.isCashOut;
    this.isDeposit = this.data.isDeposit;
    this.empty = this.data.empty;
    this.types = this.data.types;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
