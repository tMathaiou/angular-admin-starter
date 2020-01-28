import {Component, OnDestroy, OnInit} from '@angular/core';
import {UsersService} from './users.service';
import {of, Subscription} from 'rxjs';
import {UserClass} from '../../classes/user.class';
import {DefaultConfig} from '../../default-config';
import {ActivatedRoute, Router} from '@angular/router';
import {mergeMap} from 'rxjs/operators';
import {SocketService} from '../../services/socket.service';
import {ToastrService} from 'ngx-toastr';
import {LangChangeEvent, TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-users-form',
  templateUrl: './users-form.component.html',
  styleUrls: ['./users-form.component.css']
})
export class UsersFormComponent implements OnInit, OnDestroy {
  public user: UserClass = new UserClass();
  public passwordMinLength: number = DefaultConfig.passwordMinLength;
  public index = -1;
  public messages = {
    already_updated: '',
    entity_deleted: ''
  };
  private subscriptions: Subscription[] = [];

  constructor(
    private usersService: UsersService,
    private router: Router,
    private route: ActivatedRoute,
    private toaster: ToastrService,
    private translateService: TranslateService,
  ) {
    this.subscriptions.push(this.translateService.onLangChange
      .subscribe((event: LangChangeEvent) => this.messages = event.translations.messages));
    this.subscriptions.push(this.translateService.getTranslation(this.translateService.currentLang)
      .subscribe((event: any) => this.messages = event.messages));
  }

  public save(): void {
    this.subscriptions.push(
      this.usersService[this.index === -1 ? 'save' : 'update'](this.user)
        .subscribe(() => this.router.navigate(['/users/list']).then(() => null))
    );
  }


  public checkMin(min: number, e: Event, input: any): void {
    if (min > input.viewModel.length) {
      input.control.setErrors({checkMin: true});
    }
  }

  public sameAs(e: Event, input: any, value: any): void {
    if (input.viewModel !== value) {
      input.control.setErrors({sameAs: true});
    }
  }

  public ngOnInit(): void {
    this.subscriptions.push(
      this.route.queryParams
        .pipe(mergeMap(() => this.route.params))
        .pipe(mergeMap((params: any) => {
          if (!params.id) {
            return of(this.user);
          }
          this.index = +params.id;
          const socketService = SocketService.getSocket();
          this.subscriptions.push(socketService.onEvent(`refresh-users-${this.index}`).subscribe( () => {
            this.usersService.get(this.index).subscribe((result: UserClass) => this.user = result, (err) => console.log(err));
            console.log(this.messages.already_updated);
            this.toaster.warning(this.messages.already_updated);
          }));

          this.subscriptions.push(
            socketService.onEvent(`refresh-users-delete`).subscribe(() => {
              this.toaster.warning(this.messages.entity_deleted);
              return this.router.navigateByUrl('/users/list');
            }),
          );

          return this.usersService.get(this.index);
        })).subscribe((result: UserClass) => this.user = result, (err) => console.log(err))
    );
  }

  public ngOnDestroy(): void {
    this.subscriptions.map((sub: Subscription) => sub.unsubscribe());
  }
}
