import {Component, OnInit} from '@angular/core';
import {Ranges} from '../../model/ranges.model';
import {RangesService} from './ranges.service';
import {Type} from '../../model/type.model';
import {MatDialog, MatSnackBar} from '@angular/material';
import {DialogComponent} from "../../utils/dialog/dialog.component";
import {AuthService} from "../../auth/auth.service";

@Component({
  selector: 'app-ranges',
  templateUrl: './ranges.component.html',
  styleUrls: ['./ranges.component.css']
})
export class RangesComponent implements OnInit {
  ranges: Ranges [] = [];
  setRange: Ranges[] = [];
  types: Type [] = [];
  background_color = '';
  background_color_added = 'green';
  typeSelected: Type = null;
  positionSelected = null;
  cursor = 'pointer';
  email = '';
  admin = 'acuco1988@gmail.com';
  isAdmin = false;

  constructor(private rangesService: RangesService, public dialog: MatDialog, public snackBar: MatSnackBar, private auth: AuthService) {
    this.email = auth.currentUser.email;
  }

  ngOnInit() {
    if (this.email === this.admin) {
      this.cursor = 'pointer';
      this.isAdmin = true;
    } else {
      this.cursor = 'auto';
      this.isAdmin = false;
    }

    this.getDefault();
    this.getTypes();
  }

  setPosition(position) {
    this.positionSelected = position;
  }

  getDefault() {
    this.rangesService.getModel().subscribe((data) => {
      console.log(data);
      this.ranges = data;
    }, error => {
      console.log(error);
    });
  }

  getTypes() {
    this.rangesService.getTypes().subscribe((data) => {
      console.log(data);
      this.types = data;
    }, error => {
      console.log(error);
    });
  }

  saveModel() {
    this.rangesService.saveModel(this.ranges).subscribe((data) => {
      alert(data);
    }, error2 => {
      alert(error2);
    });
  }

  save() {
    this.rangesService.saveRanges(this.setRange).subscribe((data) => {
      this.setRange = [];
      this.typeSelected = null;
      this.positionSelected = null;
    }, error2 => {
      alert(error2.toString());
    });
  }

  addType() {
    const dialogRefCash = this.dialog.open(DialogComponent, {
      height: '400px',
      width: '400px',
      disableClose: true,
      data:
        {
          'loading': false,
          'isFromCash': false,
          'isCashOut': false,
          'types': true
        }
    });

    dialogRefCash.afterClosed().subscribe(result => {
      if (result !== undefined) {
        const type: Type = new Type(result.typeName, result.color);
        this.types.push(type);
        this.rangesService.saveType(type).subscribe(() => {
          this.snackBar.open('Type saved', '', {
            duration: 3000
          });
        });
      }
    });
  }

  add(range: Ranges) {
    if (this.isAdmin) {
      if (this.typeSelected !== null && this.positionSelected !== null) {
        let found = false;
        for (let i = 0; i < this.setRange.length; i++) {
          if (this.setRange[i].value === range.value && this.setRange[i].kind === range.kind) {
            found = true;
          }
        }

        if (!found) {
          this.setRange.push(range);
          console.log(this.setRange);
        }
      } else {
        alert('You must select a type and a position first.');
      }
    }
  }

  selectType(t: Type) {
    this.typeSelected = t;
  }
}


