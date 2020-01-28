import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {ConfigService} from '../services/configService';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private configService: ConfigService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    let token;

    try {
      token = localStorage.getItem('token');
    } catch (e) {
      console.log(e);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      this.configService.setToken(null);
      this.configService.setLoggedIn(false);
    }

    if (!token) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      this.configService.setToken(null);
      this.configService.setLoggedIn(false);
      return false;
    }
    return true;
  }
}
