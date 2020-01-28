import {RouterModule} from '@angular/router';
import {HomeComponent} from './modules/home/home.component';
import {faHome, faUsers} from '@fortawesome/free-solid-svg-icons';

export const APP_ROUTES: any = [
  {
    path: '',
    urlPath: '/view',
    name: 'home',
    component: HomeComponent,
    icon: faHome,
    menu: true,
  },
  {
    path: 'users',
    urlPath: '/users/list',
    name: 'users',
    icon: faUsers,
    menu: true,
    loadChildren: './../app/modules/users/users.module#UsersModule'
  },
];

export const routing = RouterModule.forRoot(APP_ROUTES);
