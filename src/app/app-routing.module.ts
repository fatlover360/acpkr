import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {LoginComponent} from './public/login/login.component';
import {HomeComponent} from './public/home/home.component';
import {UsersComponent} from './private/users/users.component';
import {RangesComponent} from './private/ranges/ranges.component';
import {ProfileComponent} from './private/profile/profile.component';

import {AdminComponent} from './private/admin/admin.component';


const appRoutes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'home', component: HomeComponent},
  {path: 'users', component: UsersComponent},
  {path: 'ranges', component: RangesComponent},
  {path: 'ranges_cash', component: RangesComponent},
  {path: 'ranges_static', component: RangesComponent},
  {path: 'ranges_bb', component: RangesComponent},
  {path: 'profile', component: ProfileComponent},
  {path: 'admin', component: AdminComponent},
  /*{path: 'forum', component: ForumComponent, children: [
    {path: '', component: PostListComponent},
    {path: 'post/new', component: PostEditComponent},
    {path: 'post/:id', component: PostComponent},
    {path: 'post/:id/edit', component: PostEditComponent}
  ]}*/
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
