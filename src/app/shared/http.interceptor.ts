import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {catchError, delay, finalize} from 'rxjs/operators';
import {ConfigService} from '../services/configService';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private configService: ConfigService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.configService.setLoading(true)
    return next.handle(request)
      .pipe(finalize(() => setTimeout(() => this.configService.setLoading(false), 500)))
      .pipe(catchError((err: HttpErrorResponse) => {
        if (err.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          this.configService.setToken(null);
          this.configService.setLoggedIn(false);
          this.configService.setLoading(false);
        }
        return Observable.throw(err);
      }));
  }
}
