import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot
} from '@angular/router';
import { Store } from '@ngxs/store';
import { Logout } from '../../state/app.actions';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private store: Store) {}

  public canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const token = localStorage.getItem('token');

    if (!token) {
      this.store.dispatch(new Logout());
      return false;
    }
    return true;
  }
}
