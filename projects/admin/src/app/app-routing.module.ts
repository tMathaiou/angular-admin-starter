/* istanbul ignore file */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RouterExtended } from './shared/interfaces/router-extended';
import { HomeComponent } from './home/home.component';
import { faHome, faUsers } from '@fortawesome/free-solid-svg-icons';
import { AuthGuard } from './shared/guards/auth.guard';

export const routes: RouterExtended[] = [
  {
    path: '',
    urlPath: '/view',
    name: 'home',
    component: HomeComponent,
    canLoad: [AuthGuard],
    icon: faHome,
    menu: true
  },
  {
    path: 'users',
    urlPath: '/users/list',
    name: 'users',
    canLoad: [AuthGuard],
    icon: faUsers,
    menu: true,
    loadChildren: () =>
      import('./users/users.module').then((m) => m.UsersModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
