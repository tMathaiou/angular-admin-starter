import {RouterModule, Routes} from '@angular/router';
import {UsersComponent} from './users.component';
import {UsersStartComponent} from './users-start.component';
import {UsersFormComponent} from './users-form.component';
import {AuthGuard} from '../../shared/auth.guard';


const USERS_ROUTES: Routes = [
  {
    path: '',
    component: UsersStartComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'list',
        urlPath: '/users/list',
        canActivate: [AuthGuard],
        name: 'users',
        component: UsersComponent
      }, {
        path: 'new',
        urlPath: '/users/new',
        canActivate: [AuthGuard],
        name: 'usersFormNew',
        component: UsersFormComponent
      }, {
        path: ':id',
        urlPath: '/users/:id',
        canActivate: [AuthGuard],
        name: 'usersFormEdit',
        component: UsersFormComponent
      }
    ] as any
  }
];

export const UsersRouting = RouterModule.forChild(USERS_ROUTES);
