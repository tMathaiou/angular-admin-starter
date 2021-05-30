import { Injectable } from '@angular/core';
import {
  Action,
  NgxsAfterBootstrap,
  Selector,
  State,
  StateContext
} from '@ngxs/store';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Pagination } from '../../shared/interfaces/pagination';
import { UserFilters } from '../../shared/interfaces/userFilters';
import { User } from '../../shared/interfaces/user';
import { UsersService } from '../users.service';
import { catchError, tap } from 'rxjs/operators';
import { EMPTY, Observable, Subscription } from 'rxjs';
import { List } from '../../shared/interfaces/list';
import { Logout } from '../../state/app.actions';
import { AppStateModel } from '../../state/app.state';
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

export interface UserStateModel {
  user: User;
  users: User[];
  filters: UserFilters;
  pagination: Pagination;
}

@Injectable()
@State<UserStateModel>({
  name: 'userState',
  defaults: {
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
  }
})
export class UserState implements NgxsAfterBootstrap {
  constructor(
    private translateService: TranslateService,
    private usersService: UsersService,
    private router: Router,
    private toaster: ToastrService
  ) {}

  @Selector([UserState])
  public static users({ users }: UserStateModel): User[] {
    return users;
  }

  @Selector([UserState])
  public static user({ user }: UserStateModel): User {
    return user;
  }

  @Selector([UserState])
  public static filters({ filters }: UserStateModel): UserFilters {
    return filters;
  }

  @Selector([UserState])
  public static pagination({ pagination }: UserStateModel): Pagination {
    return pagination;
  }

  public ngxsAfterBootstrap(
    context: StateContext<UserStateModel>
  ): Subscription {
    return this.fetchUsersFn(context).subscribe();
  }

  private fetchUsersFn({
    patchState,
    getState
  }: StateContext<UserStateModel>): Observable<List<User>> {
    const { filters, pagination } = getState();
    return this.usersService.list({ ...filters, ...pagination }).pipe(
      tap((list) => {
        return patchState({
          users: list.rows,
          pagination: {
            ...pagination,
            totalElements: list.count
          }
        });
      })
    );
  }

  @Action(SetPage)
  public setPage(
    { patchState, getState, dispatch }: StateContext<UserStateModel>,
    { page }: SetPage
  ): void {
    const { pagination } = getState();

    patchState({
      pagination: {
        ...pagination,
        page
      }
    });

    dispatch(new FetchUsers());
  }

  @Action(SetTotalElements)
  public setTotalElements(
    { patchState, getState }: StateContext<UserStateModel>,
    { totalElements }: SetTotalElements
  ): void {
    const { pagination } = getState();

    patchState({
      pagination: {
        ...pagination,
        totalElements
      }
    });
  }

  @Action(SetFilters)
  public setFilters(
    { patchState }: StateContext<UserStateModel>,
    { filters }: SetFilters
  ): void {
    patchState({ filters });
  }

  @Action(SetUser)
  public setUser(
    { patchState }: StateContext<UserStateModel>,
    { user }: SetUser
  ): void {
    patchState({ user });
  }

  @Action(FetchUsers)
  public fetchUsers(
    context: StateContext<UserStateModel>
  ): Observable<List<User>> {
    return this.fetchUsersFn(context);
  }

  @Action(FetchUser)
  public fetchUser(
    { patchState }: StateContext<UserStateModel>,
    { id }: FetchUser
  ): Observable<User> {
    return this.usersService.get(id).pipe(
      tap((user) => {
        patchState({
          user
        });
      }),
      catchError((err) => {
        this.toaster.error(
          err.status === 422
            ? this.translateService.instant('messages.dont_exist')
            : this.translateService.instant('messages.something_went_wrong')
        );
        this.router.navigateByUrl('/users/list');
        return EMPTY;
      })
    );
  }

  @Action(SaveUser)
  public saveUser(
    {}: StateContext<UserStateModel>,
    { user }: SaveUser
  ): Observable<User> {
    return this.usersService.save(user).pipe(
      tap(() => this.router.navigateByUrl('/users/list')),
      catchError((err) => {
        console.error(err);
        this.toaster.error(
          this.translateService.instant('messages.something_went_wrong')
        );
        return EMPTY;
      })
    );
  }

  @Action(UpdateUser)
  public updateUser(
    {}: StateContext<UserStateModel>,
    { user }: UpdateUser
  ): Observable<User> {
    return this.usersService.update(user).pipe(
      tap(() => this.router.navigateByUrl('/users/list')),
      catchError((err) => {
        console.error(err);
        this.toaster.error(
          this.translateService.instant('messages.something_went_wrong')
        );
        return EMPTY;
      })
    );
  }

  @Action(DeleteUser)
  public deleteUser(
    { dispatch }: StateContext<UserStateModel>,
    { id }: DeleteUser
  ): Observable<unknown> {
    return this.usersService.delete(id).pipe(
      tap(() => dispatch(new FetchUsers())),
      catchError((err) => {
        console.error(err);
        this.toaster.error(
          this.translateService.instant('messages.something_went_wrong')
        );
        return EMPTY;
      })
    );
  }
}
