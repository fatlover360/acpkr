import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import {MaterialModule} from './utils/material.module';
import { HeaderComponent } from './header/header.component';
import { UsersComponent } from './private/users/users.component';
import { LoginComponent } from './public/login/login.component';
import { RangesComponent } from './private/ranges/ranges.component';
import {AngularFireModule} from 'angularfire2';
import { HomeComponent } from './public/home/home.component';
import {AppRoutingModule} from './app-routing.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {AuthService} from './auth/auth.service';
import {AngularFireAuth} from 'angularfire2/auth';
import {AngularFireDatabase, AngularFireDatabaseModule} from 'angularfire2/database';
import {AngularFireAuthModule} from 'angularfire2/auth';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import { DialogComponent } from './utils/dialog/dialog.component';
import { ProfileComponent } from './private/profile/profile.component';
import { CashComponent } from './private/cash/cash.component';
import { OverviewComponent } from './private/overview/overview.component';
import { AdminComponent } from './private/admin/admin.component';
import {ChartsModule} from 'ng2-charts';
import {FirebaseDbService} from './storage/firebase-db.service';
import {FullCalendarModule} from 'ng-fullcalendar';
import {CashService} from './private/cash/cash.service';
import {HttpModule} from "@angular/http";
import {RangesService} from "./private/ranges/ranges.service";
import { ForumComponent } from './private/forum/forum.component';
import { PostComponent } from './private/forum/post/post.component';



@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    UsersComponent,
    LoginComponent,
    RangesComponent,
    HomeComponent,
    DialogComponent,
    ProfileComponent,
    CashComponent,
    OverviewComponent,
    AdminComponent,
    ForumComponent,
    PostComponent
  ],
  imports: [
    HttpModule,
    BrowserModule,
    MaterialModule,
    FullCalendarModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ChartsModule,
    AngularFireModule.initializeApp({
      apiKey: 'AIzaSyB_RYlC9AZZSIbRRUaamSeDbWbT6PNCEvQ',
      authDomain: 'acpoker-8ccb2.firebaseapp.com',
      databaseURL: 'https://acpoker-8ccb2.firebaseio.com',
      projectId: 'acpoker-8ccb2',
      storageBucket: 'acpoker-8ccb2.appspot.com',
      messagingSenderId: '441213150564'
    }),
    AngularFireDatabaseModule,
    AngularFireAuthModule
  ],
  entryComponents: [DialogComponent],
  providers: [AuthService, CashService, AngularFireAuth, AngularFireDatabase, HttpClient, FirebaseDbService, RangesService],
  bootstrap: [AppComponent]
})
export class AppModule { }
