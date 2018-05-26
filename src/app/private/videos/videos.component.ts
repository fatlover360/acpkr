import { Component, OnInit } from '@angular/core';
import {MatDialog} from "@angular/material";
import {DialogComponent} from "../../utils/dialog/dialog.component";

@Component({
  selector: 'app-videos',
  templateUrl: './videos.component.html',
  styleUrls: ['./videos.component.css']
})
export class VideosComponent implements OnInit {

  constructor(public dialog: MatDialog) { }

  ngOnInit() {
  }

 show() {

}}
