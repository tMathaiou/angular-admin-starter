import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { SharedModule } from '../../shared/shared.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgxPaginationModule } from 'ngx-pagination';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { UserState } from '../state/user.state';
import { SocketService } from '../../shared/services/socket.service';
import { of } from 'rxjs';
import {
  FetchUser,
  SaveUser,
  SetUser,
  UpdateUser
} from '../state/user.actions';
import { UsersFormComponent } from './users-form.component';
import { User } from '../../shared/interfaces/user';
import { ActivatedRoute, Router } from '@angular/router';

describe('UsersFormComponent', () => {
  let component: UsersFormComponent;
  let fixture: ComponentFixture<UsersFormComponent>;
  let store: Store;
  let route: ActivatedRoute;
  let toaster: ToastrService;
  let router: Router;
  let translateService: TranslateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UsersFormComponent],
      imports: [
        SharedModule,
        FontAwesomeModule,
        NgxPaginationModule,
        SweetAlert2Module,
        FormsModule,
        TranslateModule.forRoot(),
        RouterTestingModule,
        HttpClientTestingModule,
        ToastrModule.forRoot(),
        NgxsModule.forRoot([UserState])
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersFormComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    route = TestBed.inject(ActivatedRoute);
    router = TestBed.inject(Router);
    toaster = TestBed.inject(ToastrService);
    translateService = TestBed.inject(TranslateService);

    jest.spyOn(SocketService, 'getSocket').mockImplementation(() => {
      return {
        onEvent(args): any {
          return of(args);
        }
      };
    });
    jest.spyOn(router, 'navigateByUrl').mockImplementation(() => null);
    SocketService.socket = {
      off: jest.fn().mockImplementation((args) => args)
    } as any;
    jest.spyOn(toaster, 'error').mockImplementation(() => null);
    jest.spyOn(toaster, 'warning').mockImplementation(() => null);
    jest.spyOn(translateService, 'instant').mockImplementation((args) => args);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('firstName', () => {
    it('should get form value firstName', () => {
      component.userForm.get('firstName').setValue('test1');

      expect(component.firstName.value).toBe('test1');
    });
  });

  describe('lastName', () => {
    it('should get form value lastName', () => {
      component.userForm.get('lastName').setValue('test2');

      expect(component.lastName.value).toBe('test2');
    });
  });

  describe('email', () => {
    it('should get form value email', () => {
      component.userForm.get('email').setValue('test@email.com');

      expect(component.email.value).toBe('test@email.com');
    });
  });

  describe('password', () => {
    it('should get form value password', () => {
      component.userForm.get('password').setValue('test');

      expect(component.password.value).toBe('test');
    });
  });

  describe('confirmPassword', () => {
    it('should get form value confirmPassword', () => {
      component.userForm.get('confirmPassword').setValue('test');

      expect(component.confirmPassword.value).toBe('test');
    });
  });

  describe('checkMin', () => {
    it('should set no errors', () => {
      component.passwordMinLength = 6;
      component.userForm.get('password').setValue('1234567');

      component.checkMin();

      expect(component.password.errors).toBe(null);
    });

    it('should set error checkMin', () => {
      component.passwordMinLength = 6;
      component.userForm.get('password').setValue('1234');

      component.checkMin();

      expect(component.password.errors).toStrictEqual({ checkMin: true });
    });
  });

  describe('sameAs', () => {
    it('should set no errors', () => {
      component.userForm.get('confirmPassword').setValue('1234567');
      component.userForm.get('password').setValue('1234567');

      component.sameAs();

      expect(component.confirmPassword.errors).toBe(null);
    });

    it('should set error checkMin', () => {
      component.userForm.get('confirmPassword').setValue('12345678');
      component.userForm.get('password').setValue('1234567');

      component.sameAs();

      expect(component.confirmPassword.errors).toStrictEqual({ sameAs: true });
    });
  });

  describe('save', () => {
    const mockUser = {
      firstName: 'test1',
      lastName: 'test2',
      password: 'test3',
      email: 'test@test.com'
    } as User;
    it('should trigger save dispatch', () => {
      Object.defineProperty(component.userForm, 'invalid', {
        value: false
      });
      component.userForm.setValue({ ...mockUser, confirmPassword: 'test3' });
      jest.spyOn(store, 'dispatch');

      component.save();

      expect(store.dispatch).toHaveBeenCalledWith(new SaveUser(mockUser));
    });

    it('should trigger update dispatch', () => {
      Object.defineProperty(component.userForm, 'invalid', {
        value: false
      });
      component.user = mockUser;
      component.index = 1;
      component.userForm.setValue({ ...mockUser, confirmPassword: 'test3' });
      jest.spyOn(store, 'dispatch');

      component.save();

      expect(store.dispatch).toHaveBeenCalledWith(new UpdateUser(mockUser));
    });

    it('should not trigger save or update dispatch', () => {
      Object.defineProperty(component.userForm, 'invalid', {
        value: true
      });
      jest.spyOn(store, 'dispatch');

      component.save();

      expect(store.dispatch).not.toHaveBeenCalled();
    });
  });

  describe('ngOnDestroy', () => {
    it('should call next and complete', () => {
      const unsubscribe$Name: any = 'unsubscribe$';
      jest.spyOn(component[unsubscribe$Name], 'next');
      jest.spyOn(component[unsubscribe$Name], 'complete');
      jest.spyOn(store, 'dispatch');

      component.ngOnDestroy();

      expect(component[unsubscribe$Name].next).toHaveBeenCalled();
      expect(component[unsubscribe$Name].complete).toHaveBeenCalled();
      expect(store.dispatch).toHaveBeenCalledWith(new SetUser(null));
      expect(SocketService.socket.off).toHaveBeenNthCalledWith(
        1,
        `refresh-users-${component.index}`
      );
      expect(SocketService.socket.off).toHaveBeenNthCalledWith(
        2,
        `refresh-users-delete-${component.index}`
      );
    });
  });

  describe('ngOnInit', () => {
    it('should not populate the form', () => {
      jest.spyOn(component.user$, 'pipe').mockReturnValue(of(null));

      component.ngOnInit();

      expect(component.userForm.value).toStrictEqual({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
      });
    });

    it('should populate the form', () => {
      const mockUser = {
        firstName: 'test',
        lastName: 'test1',
        email: 'test2@email.com'
      } as User;
      jest.spyOn(component.user$, 'pipe').mockReturnValue(of(mockUser));

      component.ngOnInit();

      expect(component.userForm.value).toStrictEqual({
        firstName: mockUser.firstName,
        lastName: mockUser.lastName,
        email: mockUser.email,
        password: '',
        confirmPassword: ''
      });
    });

    it('should not call dispatch', () => {
      jest.spyOn(route.queryParams, 'pipe').mockReturnValue(of({ id: null }));
      jest.spyOn(store, 'dispatch');

      component.ngOnInit();

      expect(store.dispatch).not.toHaveBeenCalled();
    });

    it('should call dispatch with FetchUser', () => {
      jest.spyOn(route.queryParams, 'pipe').mockReturnValue(of({ id: 2 }));
      jest.spyOn(store, 'dispatch');
      component.triggered = true;

      component.ngOnInit();

      expect(component.index).toBe(2);
      expect(store.dispatch).toHaveBeenCalledWith(new FetchUser(2));
      expect(SocketService.getSocket).toHaveBeenCalled();
      expect(toaster.warning).toHaveBeenCalledWith('messages.entity_deleted');
      expect(translateService.instant).toHaveBeenCalledWith(
        'messages.entity_deleted'
      );
      expect(router.navigateByUrl).toHaveBeenCalledWith('/users/list');
    });

    it('should call dispatch with FetchUser and update socket', () => {
      jest.spyOn(route.queryParams, 'pipe').mockReturnValue(of({ id: 2 }));
      jest.spyOn(store, 'dispatch');
      component.triggered = false;

      component.ngOnInit();

      expect(component.index).toBe(2);
      expect(store.dispatch).toHaveBeenNthCalledWith(1, new FetchUser(2));
      expect(store.dispatch).toHaveBeenNthCalledWith(2, new FetchUser(2));
      expect(SocketService.getSocket).toHaveBeenCalled();
      expect(toaster.warning).toHaveBeenNthCalledWith(
        1,
        'messages.already_updated'
      );
      expect(translateService.instant).toHaveBeenNthCalledWith(
        1,
        'messages.already_updated'
      );
      expect(toaster.warning).toHaveBeenNthCalledWith(
        2,
        'messages.entity_deleted'
      );
      expect(translateService.instant).toHaveBeenNthCalledWith(
        2,
        'messages.entity_deleted'
      );
      expect(router.navigateByUrl).toHaveBeenCalledWith('/users/list');
    });
  });
});
