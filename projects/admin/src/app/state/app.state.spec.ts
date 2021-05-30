import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AppState, AppStateModel } from './app.state';
import { NgxsModule, Store } from '@ngxs/store';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrModule, ToastrService } from 'ngx-toastr';
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
import { User } from '../shared/interfaces/user';
import { AppService } from '../app.service';
import { of, throwError } from 'rxjs';
import { Login } from '../shared/interfaces/login';
import { Router } from '@angular/router';

describe('AppState', () => {
  const initialData: AppStateModel = {
    isSidebarOpen: false,
    langID: 0,
    loggedIn: false,
    loading: false,
    token: '',
    user: null
  };
  let state: AppState;
  let store: Store;
  let appService: AppService;
  let toaster: ToastrService;
  let router: Router;
  let translateService: TranslateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NgxsModule.forRoot([AppState]),
        TranslateModule.forRoot(),
        HttpClientTestingModule,
        RouterTestingModule,
        ToastrModule.forRoot()
      ]
    });

    state = TestBed.inject(AppState);
    store = TestBed.inject(Store);
    toaster = TestBed.inject(ToastrService);
    router = TestBed.inject(Router);
    appService = TestBed.inject(AppService);
    translateService = TestBed.inject(TranslateService);

    store.reset({ appState: initialData });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('selectors', () => {
    describe('isSidebarOpen', () => {
      it('should test selector isSidebarOpen', () => {
        expect(store.selectSnapshot(AppState.isSidebarOpen)).toBe(
          initialData.isSidebarOpen
        );
      });
    });

    describe('langID', () => {
      it('should test selector langID', () => {
        expect(store.selectSnapshot(AppState.langID)).toBe(initialData.langID);
      });
    });

    describe('loggedIn', () => {
      it('should test selector loggedIn', () => {
        expect(store.selectSnapshot(AppState.loggedIn)).toBe(
          initialData.loggedIn
        );
      });
    });

    describe('loading', () => {
      it('should test selector loading', () => {
        expect(store.selectSnapshot(AppState.loading)).toBe(
          initialData.loading
        );
      });
    });

    describe('token', () => {
      it('should test selector token', () => {
        expect(store.selectSnapshot(AppState.token)).toBe(initialData.token);
      });
    });

    describe('user', () => {
      it('should test selector user', () => {
        expect(store.selectSnapshot(AppState.user)).toBe(initialData.user);
      });
    });
  });

  describe('actions', () => {
    describe('ToggleSidebar', () => {
      it('should patch the state with true', () => {
        store.dispatch(new ToggleSidebar());

        expect(store.selectSnapshot(AppState.isSidebarOpen)).toBe(true);
      });
    });

    describe('SetLangID', () => {
      it('should patch the state with 1 and call sessionStorage setItem', () => {
        jest.spyOn(localStorage, 'setItem');

        store.dispatch(new SetLangID(1));

        expect(localStorage.setItem).toHaveBeenCalledWith('language', 'el');
        expect(store.selectSnapshot(AppState.langID)).toBe(1);
      });

      it('should patch the state with 0 and call sessionStorage setItem', () => {
        jest.spyOn(localStorage, 'setItem');

        store.dispatch(new SetLangID(0));

        expect(localStorage.setItem).toHaveBeenCalledWith('language', 'en');
        expect(store.selectSnapshot(AppState.langID)).toBe(0);
      });
    });

    describe('SetLoggedIn', () => {
      it('should patch the state with true', () => {
        store.dispatch(new SetLoggedIn(true));

        expect(store.selectSnapshot(AppState.loggedIn)).toBe(true);
      });
    });

    describe('SetLoading', () => {
      it('should patch the state with true', () => {
        store.dispatch(new SetLoading(true));

        expect(store.selectSnapshot(AppState.loading)).toBe(true);
      });
    });

    describe('SetToken', () => {
      it('should patch the state with abc', () => {
        store.dispatch(new SetToken('abc'));

        expect(store.selectSnapshot(AppState.token)).toBe('abc');
      });
    });

    describe('SetUser', () => {
      it('should patch the state with a user', () => {
        const mockUser = { firstName: 'test', lastName: 'test' } as User;

        store.dispatch(new SetUser(mockUser));

        expect(store.selectSnapshot(AppState.user)).toBe(mockUser);
      });
    });

    describe('Logout', () => {
      it('should call localStorage remove item for token and user', () => {
        jest.spyOn(localStorage, 'removeItem');

        store.dispatch(new Logout());

        expect(localStorage.removeItem).toHaveBeenNthCalledWith(1, 'token');
        expect(localStorage.removeItem).toHaveBeenNthCalledWith(2, 'user');
        expect(store.selectSnapshot(AppState.token)).toBe(null);
        expect(store.selectSnapshot(AppState.loggedIn)).toBe(false);
      });
    });

    describe('LoginUser', () => {
      const credentials = { email: 'test@email.com', password: 'test' };
      it('should call appService Login and set token and user', () => {
        const mockResponse = {
          token: 'abc',
          user: {
            firstName: 'test',
            lastName: 'test'
          }
        } as Login;
        jest.spyOn(appService, 'login').mockReturnValue(of(mockResponse));
        jest.spyOn(localStorage, 'setItem');
        jest.spyOn(router, 'navigateByUrl').mockImplementation(() => null);

        store.dispatch(new LoginUser(credentials.email, credentials.password));

        expect(appService.login).toHaveBeenCalledWith(
          credentials.email,
          credentials.password
        );
        expect(localStorage.setItem).toHaveBeenNthCalledWith(
          1,
          'token',
          mockResponse.token
        );
        expect(localStorage.setItem).toHaveBeenNthCalledWith(
          2,
          'user',
          JSON.stringify(mockResponse.user)
        );
        expect(store.selectSnapshot(AppState.token)).toBe(mockResponse.token);
        expect(store.selectSnapshot(AppState.loggedIn)).toStrictEqual(true);
        expect(router.navigateByUrl).toHaveBeenCalledWith('/view');
      });
      it('should call fail with error ', () => {
        jest.spyOn(appService, 'login').mockReturnValue(throwError({}));
        jest.spyOn(toaster, 'error').mockImplementation(() => null);
        jest
          .spyOn(translateService, 'instant')
          .mockImplementation((args) => args);

        store.dispatch(new LoginUser(credentials.email, credentials.password));

        expect(appService.login).toHaveBeenCalledWith(
          credentials.email,
          credentials.password
        );
        expect(toaster.error).toHaveBeenCalledWith('commons.wrong_credentials');
        expect(translateService.instant).toHaveBeenCalledWith(
          'commons.wrong_credentials'
        );
      });
    });
  });
});
