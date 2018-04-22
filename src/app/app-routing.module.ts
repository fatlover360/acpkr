import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {LoginComponent} from './public/login/login.component';
import {HomeComponent} from './public/home/home.component';
import {UsersComponent} from './private/users/users.component';
import {RangesComponent} from './private/ranges/ranges.component';
import {ProfileComponent} from './private/profile/profile.component';
import {OverviewComponent} from './private/overview/overview.component';
import {CashComponent} from './private/cash/cash.component';
import {AdminComponent} from './private/admin/admin.component';
import {ForumComponent} from './private/forum/forum.component';
import {PostComponent} from './private/forum/post/post.component';

const appRoutes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'home', component: HomeComponent},
  {path: 'users', component: UsersComponent},
  {path: 'ranges', component: RangesComponent},
  {path: 'profile', component: ProfileComponent},
  {path: 'overview', component: OverviewComponent},
  {path: 'cash', component: CashComponent},
  {path: 'admin', component: AdminComponent},
  {path: 'forum', component: ForumComponent, children: [
    {path: 'post', component: PostComponent}
  ]}
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
