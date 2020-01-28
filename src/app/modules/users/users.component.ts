import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserClass} from '../../classes/user.class';
import {faEdit, faTrash} from '@fortawesome/free-solid-svg-icons';
import {IconDefinition} from '@fortawesome/fontawesome-common-types';
import {UsersService} from './users.service';
import {Subscription} from 'rxjs';
import {ListClass} from '../../classes/list.class';
import {DefaultConfig} from '../../default-config';
import {SocketService} from '../../services/socket.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit, OnDestroy {
  public debounceTime: number = DefaultConfig.debounceTime;
  public filter: {
    user_id: number | null;
    user_firstName: string | null;
    user_lastName: string | null;
    user_email: string | null;
  } = {
    user_id: null,
    user_firstName: null,
    user_lastName: null,
    user_email: null,
  };
  public limit = 10;
  public page = 1;
  public totalItems = 0;
  public users: UserClass[] = [];
  public iconEdit: IconDefinition = faEdit;
  public iconTrash: IconDefinition = faTrash;
  private subscriptions: Subscription[] = [];


  constructor(
    private usersService: UsersService,
  ) {
  }

  public fetchUsers(): void {
    this.subscriptions.push(
      this.usersService.list({
        limit: this.limit,
        page: this.page,
        ...this.filter,
      }).subscribe((data: ListClass<UserClass>) => {
        this.users = data.rows;
        this.totalItems = data.count;
      })
    );
  }

  public pageChanged(page: number): void {
    this.page = page;
    this.fetchUsers();
  }

  public clearFilters(): void {
    this.filter = {
      user_id: null,
      user_firstName: null,
      user_lastName: null,
      user_email: null,
    };
  }

  public async deleteUser(user: UserClass): Promise<any> {
    this.subscriptions.push(
      this.usersService.del(user).subscribe(() => this.fetchUsers())
    );
  }

  public ngOnInit(): void {
    const socketService = SocketService.getSocket();
    this.fetchUsers();
    this.subscriptions.push(socketService.onEvent('refresh-users').subscribe(() => this.fetchUsers()));
  }

  public ngOnDestroy(): void {
    this.subscriptions.map((sub: Subscription) => sub.unsubscribe());
  }
}
