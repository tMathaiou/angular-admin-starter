import { User } from '../shared/interfaces/user';
import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import {
  LoginUser,
  Logout,
  SetLangID,
  SetLoading,
  SetLoggedIn,
  SetToken,
  SetUser,
  ToggleSidebar
} from './app.actions';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from '../app.service';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { EMPTY, Observable } from 'rxjs';
import { Login } from '../shared/interfaces/login';
import { ToastrService } from 'ngx-toastr';

export interface AppStateModel {
  isSidebarOpen: boolean;
  langID: number;
  loggedIn: boolean;
  loading: boolean;
  token: string;
  user: User;
}

const lang = localStorage.getItem('language');

@Injectable()
@State<AppStateModel>({
  name: 'appState',
  defaults: {
    isSidebarOpen: false,
    langID: lang ? (lang === 'el' ? 1 : 0) : 1,
    loggedIn: !!localStorage.getItem('token'),
    loading: false,
    token: '',
    user: null
  }
})
export class AppState {
  constructor(
    private translateService: TranslateService,
    private appService: AppService,
    private router: Router,
    private toaster: ToastrService
  ) {}

  @Selector([AppState])
  public static isSidebarOpen({ isSidebarOpen }: AppStateModel): boolean {
    return isSidebarOpen;
  }

  @Selector([AppState])
  public static langID({ langID }: AppStateModel): number {
    return langID;
  }

  @Selector([AppState])
  public static loggedIn({ loggedIn }: AppStateModel): boolean {
    return loggedIn;
  }

  @Selector([AppState])
  public static loading({ loading }: AppStateModel): boolean {
    return loading;
  }

  @Selector([AppState])
  public static token({ token }: AppStateModel): string {
    return token;
  }

  @Selector([AppState])
  public static user({ user }: AppStateModel): User {
    return user;
  }

  @Action(ToggleSidebar)
  public toggleSidebar({
    patchState,
    getState
  }: StateContext<AppStateModel>): void {
    const { isSidebarOpen } = getState();
    patchState({
      isSidebarOpen: !isSidebarOpen
    });
  }

  @Action(SetLangID)
  public setLangID(
    { patchState }: StateContext<AppStateModel>,
    { langID }: SetLangID
  ): void {
    const langString = langID === 0 ? 'en' : 'el';
    localStorage.setItem('language', langString);
    this.translateService.use(langString);

    patchState({ langID });
  }

  @Action(SetLoggedIn)
  public setLoggedIn(
    { patchState }: StateContext<AppStateModel>,
    { loggedIn }: SetLoggedIn
  ): void {
    patchState({ loggedIn });
  }

  @Action(SetLoading)
  public setLoading(
    { patchState }: StateContext<AppStateModel>,
    { loading }: SetLoading
  ): void {
    patchState({ loading });
  }

  @Action(SetToken)
  public setToken(
    { patchState }: StateContext<AppStateModel>,
    { token }: SetToken
  ): void {
    patchState({ token });
  }

  @Action(SetUser)
  public setUser(
    { patchState }: StateContext<AppStateModel>,
    { user }: SetUser
  ): void {
    patchState({ user });
  }

  @Action(Logout)
  public logout({ patchState }: StateContext<AppStateModel>): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    patchState({ token: null, loggedIn: false });
  }

  @Action(LoginUser)
  public login(
    { patchState }: StateContext<AppStateModel>,
    { email, password }: LoginUser
  ): Observable<Login> {
    return this.appService.login(email, password).pipe(
      tap(({ token, user }) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        patchState({ token, loggedIn: true });

        return this.router.navigateByUrl('/view');
      }),
      catchError(() => {
        this.toaster.error(
          this.translateService.instant(`commons.wrong_credentials`)
        );
        return EMPTY;
      })
    );
  }
}
