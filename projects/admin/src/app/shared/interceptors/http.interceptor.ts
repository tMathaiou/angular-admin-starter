import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { Store } from '@ngxs/store';
import { SetLoading, SetLoggedIn, SetToken } from '../../state/app.actions';
import { AppState } from '../../state/app.state';

@Injectable()
export class HttpExtendInterceptor implements HttpInterceptor {
  constructor(private store: Store) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');
    this.store.dispatch(new SetLoading(true));

    console.log(token);

    const req = token
      ? request.clone({
          setHeaders: {
            Authorization: token
          }
        })
      : request;

    return next
      .handle(req)
      .pipe(
        finalize(() =>
          setTimeout(() => this.store.dispatch(new SetLoading(false)), 500)
        )
      )
      .pipe(
        catchError((err: HttpErrorResponse) => {
          if (err.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            this.store.dispatch(new SetToken(null));
            this.store.dispatch(new SetLoggedIn(false));
            this.store.dispatch(new SetLoading(false));
          }
          return throwError(err);
        })
      );
  }
}
