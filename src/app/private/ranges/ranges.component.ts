import {Component, OnInit} from '@angular/core';
import {Ranges} from '../../model/ranges.model';
import {RangesService} from './ranges.service';
import {Type} from '../../model/type.model';
import {MatDialog, MatSnackBar} from '@angular/material';
import {DialogComponent} from '../../utils/dialog/dialog.component';
import {AuthService} from '../../auth/auth.service';
import {ActivatedRoute, Params, UrlSegment} from "@angular/router";

@Component({
  selector: 'app-ranges',
  templateUrl: './ranges.component.html',
  styleUrls: ['./ranges.component.css']
})
export class RangesComponent implements OnInit {
  blinds: any [] = [
    {'value': '10-15', 'color': 'darkred'},
    {'value': '15-22', 'color': 'red'},
    {'value': '22-30', 'color': 'orange'},
    {'value': '30-40', 'color': 'yellow'},
    {'value': '40+', 'color': 'green'}];
  ranges: Ranges [] = [];
  rangesInMemory: Ranges[] = [];
  rangesToAdd: Ranges[] = [];
  types: Type [] = [];
  background_color = '';
  typeSelected: Type = null;
  positionSelected = null;
  blindSelected = null;
  gametypeSelected = null;
  colorSelected = null;
  percentageSelected = 0;
  cursor = 'pointer';
  email = '';
  admin = 'acuco1988@gmail.com';
  admin2 = 'joaocsvieira92@gmail.com';
  isAdmin = false;
  loading = true;
  loadingTypes = true;

  constructor(private rangesService: RangesService, public dialog: MatDialog, public snackBar: MatSnackBar, private auth: AuthService, private route: ActivatedRoute) {
    this.email = auth.currentUser.email;
  }

  ngOnInit() {
    this.route.url.subscribe(
      (url: UrlSegment[]) => {
        if (url[0].path === 'ranges_bb') {
          this.gametypeSelected = 'BB Ranges';
        } else {
          this.gametypeSelected = 'Static Ranges';
        }
      }
    );
    if (this.email === this.admin || this.email === this.admin2) {
      this.cursor = 'pointer';
      this.isAdmin = true;
    } else {
      this.cursor = 'auto';
      this.isAdmin = false;
    }

    this.getDefault();
    this.getTypes();
  }

  clearArray() {
    this.rangesInMemory.forEach(c => {
      c.percentage = 0;
      c.position = '';
      c.type = 'DEFAULT';
      c.color = null;
    });
    this.rangesToAdd = [];
  }

  setPosition(position) {
    this.positionSelected = position;
    this.getByTypeAndPosition();
  }

  getDefault() {
    this.loading = true;
    setTimeout(t => {
      this.rangesService.getModel().subscribe((data) => {
        this.ranges = data;
        this.rangesInMemory = data;
        this.loading = false;
        console.log(this.rangesInMemory);
      }, error => {
        console.log(error);
        this.loading = false;
      });

    }, 1000);
  }

  getTypes() {
    this.loadingTypes = true;
    this.rangesService.getTypes(this.gametypeSelected).subscribe((data) => {
      this.types = data;
      this.loadingTypes = false;
    }, error => {
      this.loadingTypes = false;
      console.log(error);
    });
  }

  saveModel() {
    this.rangesService.saveModel(this.ranges).subscribe((data) => {

    }, error2 => {
      alert(error2);
    });
  }

  save() {
    this.rangesService.saveRanges(this.rangesToAdd).subscribe((data) => {
      this.clearArray();
      this.snackBar.open('Range saved for ' + this.positionSelected + ' /' + this.typeSelected.type + ' ' + this.blindSelected.value
        + ' ' + this.gametypeSelected, '', {
        duration: 5000
      });
      this.typeSelected = null;
      this.positionSelected = null;
      this.blindSelected = null;
      this.colorSelected = null;
    }, error2 => {
      alert(error2.toString());
    });
  }

  addType() {
    const dialogRefCash = this.dialog.open(DialogComponent, {
      height: '300px',
      width: '300px',
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
        const type: Type = new Type(result.typeName, result.color, this.gametypeSelected);
        this.types.push(type);
        this.rangesService.saveType(type).subscribe(() => {
          this.snackBar.open('Type saved', '', {
            duration: 5000
          });
        });
      }
    });
  }

  add(range: Ranges) {
    if (this.isAdmin) {
      if (this.percentageSelected > 100 || this.percentageSelected < 0) {
        alert('Percentage must be between 0 and 100');
      } else {
        if (this.typeSelected !== null && this.positionSelected !== null && this.blindSelected !== null
          && this.gametypeSelected !== null && this.colorSelected !== null) {
          let found = false;
          let index = 0;
          let indexReset = 0;
          for (let i = 0; i < this.rangesInMemory.length; i++) {
            if (this.rangesInMemory[i].value === range.value && this.rangesInMemory[i].kind === range.kind) {
              indexReset = i;
              this.rangesInMemory[i].type = this.typeSelected.type;
              this.rangesInMemory[i].percentage = this.percentageSelected;
              this.rangesInMemory[i].position = this.positionSelected;
              this.rangesInMemory[i].blind = this.blindSelected.value;
              this.rangesInMemory[i].gameType = this.gametypeSelected;
              this.rangesInMemory[i].color = this.colorSelected;
            }
          }

          for (let i = 0; i < this.rangesToAdd.length; i++) {
            if (this.rangesToAdd[i].value === range.value && this.rangesToAdd[i].kind === range.kind) {
              found = true;
              index = i;
              this.rangesToAdd[i].type = this.typeSelected.type;
              this.rangesToAdd[i].percentage = this.percentageSelected;
              this.rangesToAdd[i].position = this.positionSelected;
              this.rangesToAdd[i].blind = this.blindSelected.value;
              this.rangesToAdd[i].gameType = this.gametypeSelected;
              this.rangesToAdd[i].color = this.colorSelected;
            }
          }

          if (!found) {
            this.rangesToAdd.push(new Ranges(range.value, range.type,
              range.percentage, range.kind, range.position, range.blind, range.gameType, range.color));
            console.log(this.rangesToAdd);
          } else {
            this.rangesInMemory[indexReset].type = 'DEFAULT';
            this.rangesInMemory[indexReset].color = null;
            this.rangesToAdd.splice(index, 1);
          }
        } else {
          alert('You must select a type, a blind, a position, and game type first.');
        }
      }
    }
  }

  selectType(t: Type) {
    this.typeSelected = t;
    this.background_color = t.color;
    this.getByTypeAndPosition();
  }

  getByTypeAndPosition() {
    this.clearArray();
    if (this.blindSelected !== null && this.positionSelected !== null && this.typeSelected !== null) {
      this.loading = true;
      this.rangesService.getByTypeAndPosition(this.typeSelected, this.positionSelected, this.blindSelected.value, this.gametypeSelected)
        .subscribe( data => {
          this.rangesInMemory = data;
          this.loading = false;
      });
    }
  }

  selectBlind(t: any) {
    this.blindSelected = t;
    this.getByTypeAndPosition();
  }


  delete() {
    this.rangesService.delete(this.typeSelected).subscribe( t => {
      this.clearArray();
      let index = 0;
      this.types.forEach( i => {
        if (i === this.typeSelected) {
          this.types.splice(index, 1);
        }
        index++;
      });

      this.typeSelected = null;

      this.snackBar.open('Type range deleted', '', {
        duration: 5000
      });
    }, error => {
      console.log(error.toString());
    });
  }
}


