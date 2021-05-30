import { NgxsModule, Store } from '@ngxs/store';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { User } from '../../shared/interfaces/user';
import { of, throwError } from 'rxjs';
import { UserState, UserStateModel } from './user.state';
import { UsersService } from '../users.service';
import { List } from '../../shared/interfaces/list';
import {
  DeleteUser,
  FetchUser,
  FetchUsers,
  SaveUser,
  SetFilters,
  SetPage,
  SetTotalElements,
  SetUser,
  UpdateUser
} from './user.actions';
import { UserFilters } from '../../shared/interfaces/userFilters';

describe('UserState', () => {
  const initialData: UserStateModel = {
    user: null,
    users: [],
    filters: {
      userId: '',
      userFirstName: '',
      userLastName: '',
      userEmail: ''
    },
    pagination: {
      page: 1,
      size: 20,
      totalElements: 0
    }
  };

  const mockResponse = {
    count: 2,
    rows: [
      {
        id: 1,
        firstName: 'test1',
        lastName: 'last1',
        email: 'email1@email.com'
      },
      {
        id: 2,
        firstName: 'test2',
        lastName: 'last2',
        email: 'email2@email.com'
      }
    ]
  } as List<User>;

  let state: UserState;
  let store: Store;
  let usersService: UsersService;
  let toaster: ToastrService;
  let router: Router;
  let translateService: TranslateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NgxsModule.forRoot([UserState]),
        TranslateModule.forRoot(),
        HttpClientTestingModule,
        RouterTestingModule,
        ToastrModule.forRoot()
      ]
    });

    state = TestBed.inject(UserState);
    store = TestBed.inject(Store);
    toaster = TestBed.inject(ToastrService);
    router = TestBed.inject(Router);
    usersService = TestBed.inject(UsersService);
    translateService = TestBed.inject(TranslateService);

    store.reset({ userState: initialData });

    jest.spyOn(toaster, 'error').mockImplementation(() => null);
    jest.spyOn(translateService, 'instant').mockImplementation((args) => args);
    jest.spyOn(router, 'navigateByUrl').mockImplementation(() => null);
    jest.spyOn(console, 'error').mockImplementation(() => null);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('selectors', () => {
    describe('users', () => {
      it('should test selector users', () => {
        expect(store.selectSnapshot(UserState.users)).toBe(initialData.users);
      });
    });

    describe('user', () => {
      it('should test selector user', () => {
        expect(store.selectSnapshot(UserState.user)).toBe(initialData.user);
      });
    });

    describe('filters', () => {
      it('should test selector filters', () => {
        expect(store.selectSnapshot(UserState.filters)).toBe(
          initialData.filters
        );
      });
    });

    describe('pagination', () => {
      it('should test selector pagination', () => {
        expect(store.selectSnapshot(UserState.pagination)).toBe(
          initialData.pagination
        );
      });
    });
  });

  describe('ngxsAfterBootstrap', () => {
    it('should call fetchUserFn', () => {
      const fetchUsersFnName: any = 'fetchUsersFn';
      jest.spyOn(state, fetchUsersFnName).mockReturnValue(of());

      state.ngxsAfterBootstrap({} as any);

      expect(state[fetchUsersFnName]).toHaveBeenCalledWith({});
    });
  });

  describe('fetchUsersFn', () => {
    it('should call usersService', () => {
      const fetchUsersFnName: any = 'fetchUsersFn';
      const mockPatchState = (args) => {
        expect(args).toStrictEqual({
          users: mockResponse.rows,
          pagination: {
            totalElements: mockResponse.count
          }
        });
      };
      const mockGetState = () => {
        return {
          filters: {},
          pagination: {}
        };
      };
      jest.spyOn(usersService, 'list').mockReturnValue(of(mockResponse));

      state[fetchUsersFnName]({
        patchState: mockPatchState,
        getState: mockGetState
      }).subscribe();

      expect(usersService.list).toHaveBeenCalledWith({});
    });
  });

  describe('actions', () => {
    describe('SetPage', () => {
      it('should patch the state with 1 and call fetchUsers', () => {
        const fetchUsersFnName: any = 'fetchUsersFn';
        jest.spyOn(state, fetchUsersFnName).mockReturnValue(of());

        store.dispatch(new SetPage(1));

        expect(store.selectSnapshot(UserState.pagination)).toStrictEqual({
          ...initialData.pagination,
          page: 1
        });
        expect(state[fetchUsersFnName]).toHaveBeenCalled();
      });
    });

    describe('SetTotalElements', () => {
      it('should patch the state with 4', () => {
        store.dispatch(new SetTotalElements(4));

        expect(store.selectSnapshot(UserState.pagination).totalElements).toBe(
          4
        );
      });
    });

    describe('SetFilters', () => {
      it('should patch the state with userId: 1, userFirstName: tr', () => {
        const filters = {
          userId: '1',
          userFirstName: 'tri',
          userLastName: '',
          userEmail: ''
        } as UserFilters;

        store.dispatch(new SetFilters(filters));

        expect(store.selectSnapshot(UserState.filters)).toStrictEqual(filters);
      });
    });

    describe('SetUser', () => {
      it('should patch the state with user object', () => {
        const user = {
          id: 1,
          firstName: 'test'
        } as User;
        store.dispatch(new SetUser(user));

        expect(store.selectSnapshot(UserState.user)).toStrictEqual(user);
      });
    });

    describe('FetchUsers', () => {
      it('should call fetchUsersFn', () => {
        const fetchUsersFnName: any = 'fetchUsersFn';
        jest.spyOn(state, fetchUsersFnName).mockReturnValue(of());

        store.dispatch(new FetchUsers());

        expect(state[fetchUsersFnName]).toHaveBeenCalled();
      });
    });

    describe('FetchUser', () => {
      it('should call usersService get', () => {
        jest
          .spyOn(usersService, 'get')
          .mockReturnValue(of(mockResponse.rows[0]));

        store.dispatch(new FetchUser(1));

        expect(usersService.get).toHaveBeenCalledWith(1);
        expect(store.selectSnapshot(UserState.user)).toStrictEqual(
          mockResponse.rows[0]
        );
      });

      it('should fail to call usersService get with error 422', () => {
        jest
          .spyOn(usersService, 'get')
          .mockReturnValue(throwError({ status: 422 }));

        store.dispatch(new FetchUser(1));

        expect(toaster.error).toHaveBeenCalledWith('messages.dont_exist');
        expect(translateService.instant).toHaveBeenCalledWith(
          'messages.dont_exist'
        );
        expect(usersService.get).toHaveBeenCalledWith(1);
        expect(router.navigateByUrl).toHaveBeenCalledWith('/users/list');
        expect(store.selectSnapshot(UserState.user)).not.toStrictEqual(
          mockResponse.rows[0]
        );
      });

      it('should fail to call usersService get with error 500', () => {
        jest
          .spyOn(usersService, 'get')
          .mockReturnValue(throwError({ status: 500 }));

        store.dispatch(new FetchUser(1));

        expect(toaster.error).toHaveBeenCalledWith(
          'messages.something_went_wrong'
        );
        expect(translateService.instant).toHaveBeenCalledWith(
          'messages.something_went_wrong'
        );
        expect(usersService.get).toHaveBeenCalledWith(1);
        expect(router.navigateByUrl).toHaveBeenCalledWith('/users/list');
        expect(store.selectSnapshot(UserState.user)).not.toStrictEqual(
          mockResponse.rows[0]
        );
      });
    });

    describe('SaveUser', () => {
      it('should call usersService save', () => {
        jest.spyOn(usersService, 'save').mockReturnValue(of({} as any));

        store.dispatch(new SaveUser({} as User));

        expect(usersService.save).toHaveBeenCalledWith({});
      });

      it('should fail to call usersService save with error', () => {
        jest
          .spyOn(usersService, 'save')
          .mockReturnValue(throwError({ status: 500 }));

        store.dispatch(new SaveUser({} as User));

        expect(toaster.error).toHaveBeenCalledWith(
          'messages.something_went_wrong'
        );
        expect(translateService.instant).toHaveBeenCalledWith(
          'messages.something_went_wrong'
        );
        expect(usersService.save).toHaveBeenCalledWith({});
      });
    });

    describe('UpdateUser', () => {
      it('should call usersService update', () => {
        jest.spyOn(usersService, 'update').mockReturnValue(of({} as any));

        store.dispatch(new UpdateUser({} as User));

        expect(usersService.update).toHaveBeenCalledWith({});
      });

      it('should fail to call usersService update with error', () => {
        jest
          .spyOn(usersService, 'update')
          .mockReturnValue(throwError({ status: 500 }));

        store.dispatch(new UpdateUser({} as User));

        expect(toaster.error).toHaveBeenCalledWith(
          'messages.something_went_wrong'
        );
        expect(translateService.instant).toHaveBeenCalledWith(
          'messages.something_went_wrong'
        );
        expect(usersService.update).toHaveBeenCalledWith({});
      });
    });

    describe('DeleteUser', () => {
      it('should call usersService delete', () => {
        const fetchUsersFnName: any = 'fetchUsersFn';
        jest.spyOn(state, fetchUsersFnName).mockReturnValue(of());
        jest.spyOn(usersService, 'delete').mockReturnValue(of({} as any));

        store.dispatch(new DeleteUser(1));

        expect(usersService.delete).toHaveBeenCalledWith(1);
        expect(state[fetchUsersFnName]).toHaveBeenCalled();
      });

      it('should fail to call usersService delete with error', () => {
        jest
          .spyOn(usersService, 'delete')
          .mockReturnValue(throwError({ status: 500 }));

        store.dispatch(new DeleteUser(1));

        expect(toaster.error).toHaveBeenCalledWith(
          'messages.something_went_wrong'
        );
        expect(translateService.instant).toHaveBeenCalledWith(
          'messages.something_went_wrong'
        );
        expect(usersService.delete).toHaveBeenCalledWith(1);
      });
    });
  });
});
