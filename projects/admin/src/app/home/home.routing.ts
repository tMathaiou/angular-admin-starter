import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { HomeRouterComponent } from './home.router.component';
import { AuthGuard } from '../shared/guards/auth.guard';
import { RouterExtended } from '../shared/interfaces/router-extended';

const HOME_ROUTES: Routes = [
  {
    path: '',
    component: HomeRouterComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'view',
        canActivate: [AuthGuard],
        urlPath: '/view',
        name: 'home',
        component: HomeComponent
      }
    ] as RouterExtended[]
  }
];

export const HomeRouting = RouterModule.forChild(HOME_ROUTES);
