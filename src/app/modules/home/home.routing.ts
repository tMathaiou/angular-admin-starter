import {RouterModule, Routes} from '@angular/router';
import {HomeStartComponent} from './home-start.component';
import {HomeComponent} from './home.component';
import {AuthGuard} from '../../shared/auth.guard';


const HOME_ROUTES: Routes = [
  {
    path: '',
    component: HomeStartComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'view',
        canActivate: [AuthGuard],
        urlPath: '/view',
        name: 'home',
        component: HomeComponent
      }
    ] as any
  }
];

export const HomeRouting = RouterModule.forChild(HOME_ROUTES);
