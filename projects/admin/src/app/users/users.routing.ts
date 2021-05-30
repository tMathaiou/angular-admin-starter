import { RouterModule, Routes } from '@angular/router';
import { UsersComponent } from './users.component';
import { UsersRouterComponent } from './users.router.component';
import { UsersFormComponent } from './user-form/users-form.component';
import { AuthGuard } from '../shared/guards/auth.guard';
import { RouterExtended } from '../shared/interfaces/router-extended';

const USERS_ROUTES: Routes = [
  {
    path: '',
    component: UsersRouterComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'list',
        urlPath: '/users/list',
        canActivate: [AuthGuard],
        name: 'users',
        component: UsersComponent
      },
      {
        path: 'new',
        urlPath: '/users/new',
        canActivate: [AuthGuard],
        name: 'usersFormNew',
        component: UsersFormComponent
      },
      {
        path: ':id',
        urlPath: '/users/:id',
        canActivate: [AuthGuard],
        name: 'usersFormEdit',
        component: UsersFormComponent
      }
    ] as RouterExtended[]
  }
];

export const UsersRouting = RouterModule.forChild(USERS_ROUTES);
