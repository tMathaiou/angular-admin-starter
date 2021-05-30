import { Component, OnDestroy, OnInit } from '@angular/core';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { Observable, Subject } from 'rxjs';
import { DefaultConfig } from '../default-config';
import { UserFilters } from '../shared/interfaces/userFilters';
import { User } from '../shared/interfaces/user';
import { Select, Store } from '@ngxs/store';
import { UserState } from './state/user.state';
import { Pagination } from '../shared/interfaces/pagination';
import {
  DeleteUser,
  FetchUsers,
  SetFilters,
  SetPage
} from './state/user.actions';
import { SocketService } from '../shared/services/socket.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'angular-admin-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit, OnDestroy {
  public debounceTime: number = DefaultConfig.debounceTime;
  @Select(UserState.filters) public readonly filters$: Observable<UserFilters>;
  @Select(UserState.pagination)
  public readonly pagination$: Observable<Pagination>;
  @Select(UserState.users) public readonly users$: Observable<User[]>;

  public iconEdit: IconDefinition = faEdit;
  public iconTrash: IconDefinition = faTrash;
  private unsubscribe$ = new Subject<void>();

  constructor(private store: Store) {}

  public pageChanged(page: number): void {
    this.store.dispatch(new SetPage(page));
  }

  public clearFilters(): void {
    this.store.dispatch(
      new SetFilters({
        userId: null,
        userFirstName: null,
        userLastName: null,
        userEmail: null
      })
    );
  }

  public deleteUser(id: number): void {
    this.store.dispatch(new DeleteUser(id));
  }

  public fetchUsers(): void {
    this.store.dispatch(new FetchUsers());
  }

  public changeFilters(
    val: string,
    key: 'userId' | 'userFirstName' | 'userLastName' | 'userEmail'
  ): void {
    const filters = { ...this.store.selectSnapshot(UserState.filters) };

    filters[key] = val;

    this.store.dispatch(new SetFilters(filters));
  }

  public ngOnInit(): void {
    const socket = SocketService.getSocket();
    socket
      .onEvent('refresh-users')
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => this.store.dispatch(new FetchUsers()));
  }

  public ngOnDestroy(): void {
    SocketService.socket.off(`refresh-users`);
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
