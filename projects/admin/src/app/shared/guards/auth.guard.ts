import { Injectable } from '@angular/core';
import { CanLoad, Route, UrlSegment } from '@angular/router';
import { Store } from '@ngxs/store';
import { Logout } from '../../state/app.actions';

@Injectable()
export class AuthGuard implements CanLoad {
  constructor(private store: Store) {}

  canLoad(route: Route, segments: UrlSegment[]): boolean {
    const token = localStorage.getItem('token');

    if (!token) {
      this.store.dispatch(new Logout());
      return false;
    }
    return true;
  }
}
