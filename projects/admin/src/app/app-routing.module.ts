/* istanbul ignore file */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RouterExtended } from './shared/interfaces/router-extended';
import { HomeComponent } from './home/home.component';
import { faHome, faUsers } from '@fortawesome/free-solid-svg-icons';

export const routes: RouterExtended[] = [
  {
    path: '',
    urlPath: '/view',
    name: 'home',
    component: HomeComponent,
    icon: faHome,
    menu: true
  },
  {
    path: 'users',
    urlPath: '/users/list',
    name: 'users',
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
