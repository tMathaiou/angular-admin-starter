import { Component, OnDestroy, OnInit } from '@angular/core';
import { UsersService } from '../users.service';
import { Observable, of, Subject, Subscription } from 'rxjs';
import { DefaultConfig } from '../../default-config';
import { ActivatedRoute, Router } from '@angular/router';
import { mergeMap, takeUntil } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { Select, Store } from '@ngxs/store';
import { UserState } from '../state/user.state';
import { UserFilters } from '../../shared/interfaces/userFilters';
import { User } from '../../shared/interfaces/user';
import { SocketService } from '../../shared/services/socket.service';
import {
  FetchUser,
  SaveUser,
  SetUser,
  UpdateUser
} from '../state/user.actions';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';

@Component({
  selector: 'angular-admin-users-form',
  templateUrl: './users-form.component.html',
  styleUrls: ['./users-form.component.css']
})
export class UsersFormComponent implements OnInit, OnDestroy {
  @Select(UserState.user) public readonly user$: Observable<User>;
  public passwordMinLength: number = DefaultConfig.passwordMinLength;
  public index = -1;
  public user: User;
  private unsubscribe$ = new Subject<void>();
  public triggered = false;
  public regex =
    '^(([^<>()\\[\\]\\\\.,;:\\s@"]+(\\.[^<>()\\[\\]\\\\.,;:\\s@"]+)*)|(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$';
  public userForm: FormGroup = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    email: new FormControl('', [
      Validators.required,
      Validators.pattern(this.regex)
    ]),
    password: new FormControl(''),
    confirmPassword: new FormControl('')
  });

  constructor(
    private usersService: UsersService,
    private router: Router,
    private route: ActivatedRoute,
    private toaster: ToastrService,
    private store: Store,
    private translateService: TranslateService
  ) {}

  get firstName(): AbstractControl {
    return this.userForm.get('firstName');
  }

  get lastName(): AbstractControl {
    return this.userForm.get('lastName');
  }

  get email(): AbstractControl {
    return this.userForm.get('email');
  }

  get password(): AbstractControl {
    return this.userForm.get('password');
  }

  get confirmPassword(): AbstractControl {
    return this.userForm.get('confirmPassword');
  }

  public ngOnInit(): void {
    this.user$.pipe(takeUntil(this.unsubscribe$)).subscribe((user) => {
      if (!user) {
        return;
      }
      this.userForm = new FormGroup({
        firstName: new FormControl(user.firstName, [Validators.required]),
        lastName: new FormControl(user.lastName, [Validators.required]),
        email: new FormControl(user.email, [
          Validators.required,
          Validators.pattern(this.regex)
        ]),
        password: new FormControl(''),
        confirmPassword: new FormControl('')
      });
      this.user = user;
    });
    this.route.queryParams
      .pipe(
        takeUntil(this.unsubscribe$),
        mergeMap(() => this.route.params)
      )
      .subscribe((params) => {
        if (!params.id) {
          return;
        }

        this.index = +params.id;

        const socket = SocketService.getSocket();
        socket.onEvent(`refresh-users-${this.index}`).subscribe(() => {
          if (this.triggered) {
            return;
          }
          this.store.dispatch(new FetchUser(this.index));
          this.toaster.warning(
            this.translateService.instant('messages.already_updated')
          );
        });

        socket.onEvent(`refresh-users-delete-${this.index}`).subscribe(() => {
          this.toaster.warning(
            this.translateService.instant('messages.entity_deleted')
          );
          return this.router.navigateByUrl('/users/list');
        });

        this.store.dispatch(new FetchUser(this.index));
      });
  }

  public save(): void {
    this.userForm.markAllAsTouched();
    if (this.userForm.invalid) {
      return;
    }
    this.triggered = true;
    if (this.index > -1 && this.user) {
      this.store.dispatch(
        new UpdateUser({
          ...this.user,
          firstName: this.firstName.value,
          lastName: this.lastName.value,
          password: this.password.value,
          email: this.email.value
        })
      );
    } else {
      this.store.dispatch(
        new SaveUser({
          firstName: this.firstName.value,
          lastName: this.lastName.value,
          password: this.password.value,
          email: this.email.value
        } as User)
      );
    }
  }

  public checkMin(): void {
    if (this.passwordMinLength > this.password.value.length) {
      this.password.setErrors({ checkMin: true });
    }
  }

  public sameAs(): void {
    if (this.confirmPassword.value !== this.password.value) {
      this.confirmPassword.setErrors({ sameAs: true });
    }
  }

  public ngOnDestroy(): void {
    SocketService.socket.off(`refresh-users-${this.index}`);
    SocketService.socket.off(`refresh-users-delete-${this.index}`);
    this.store.dispatch(new SetUser(null));
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
