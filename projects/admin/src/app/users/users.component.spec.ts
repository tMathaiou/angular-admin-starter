import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { UsersComponent } from './users.component';
import { NgxsModule, Store } from '@ngxs/store';
import {
  DeleteUser,
  FetchUsers,
  SetFilters,
  SetPage
} from './state/user.actions';
import { UserState } from './state/user.state';
import { UserFilters } from '../shared/interfaces/userFilters';
import { DebounceDirective } from '../shared/directives/debounce.directive';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgxPaginationModule } from 'ngx-pagination';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';
import { SocketService } from '../shared/services/socket.service';
import { of } from 'rxjs';

describe('UsersComponent', () => {
  let component: UsersComponent;
  let fixture: ComponentFixture<UsersComponent>;
  let store: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UsersComponent],
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
    fixture = TestBed.createComponent(UsersComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    jest.spyOn(SocketService, 'getSocket').mockImplementation(() => {
      return {
        onEvent(args): any {
          return of(args);
        }
      };
    });

    SocketService.socket = {
      off: jest.fn().mockImplementation((args) => args)
    } as any;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('pageChanged', () => {
    it('should call dispatch with SetPage', () => {
      jest.spyOn(store, 'dispatch');

      component.pageChanged(3);

      expect(store.dispatch).toHaveBeenCalledWith(new SetPage(3));
    });
  });

  describe('clearFilters', () => {
    it('should call dispatch with SetFilters to null values', () => {
      jest.spyOn(store, 'dispatch');

      component.clearFilters();

      expect(store.dispatch).toHaveBeenCalledWith(
        new SetFilters({
          userId: null,
          userFirstName: null,
          userLastName: null,
          userEmail: null
        })
      );
    });
  });

  describe('deleteUser', () => {
    it('should call dispatch with DeleteUser', () => {
      jest.spyOn(store, 'dispatch');

      component.deleteUser(3);

      expect(store.dispatch).toHaveBeenCalledWith(new DeleteUser(3));
    });
  });

  describe('fetchUsers', () => {
    it('should call dispatch with FetchUsers', () => {
      jest.spyOn(store, 'dispatch');

      component.fetchUsers();

      expect(store.dispatch).toHaveBeenCalledWith(new FetchUsers());
    });
  });

  describe('changeFilters', () => {
    let filters: UserFilters;
    beforeEach(() => {
      jest.spyOn(store, 'dispatch');
      filters = { ...store.selectSnapshot(UserState.filters) };
    });

    it('should call dispatch with SetFilters input userId', () => {
      component.changeFilters('testID', 'userId');

      expect(store.dispatch).toHaveBeenCalledWith(
        new SetFilters({ ...filters, userId: 'testID' })
      );
    });

    it('should call dispatch with SetFilters input userFirstName', () => {
      component.changeFilters('testName', 'userFirstName');

      expect(store.dispatch).toHaveBeenCalledWith(
        new SetFilters({ ...filters, userFirstName: 'testName' })
      );
    });

    it('should call dispatch with SetFilters input userLastName', () => {
      component.changeFilters('testLast', 'userLastName');

      expect(store.dispatch).toHaveBeenCalledWith(
        new SetFilters({ ...filters, userLastName: 'testLast' })
      );
    });

    it('should call dispatch with SetFilters input userEmail', () => {
      component.changeFilters('testEmail', 'userEmail');

      expect(store.dispatch).toHaveBeenCalledWith(
        new SetFilters({ ...filters, userEmail: 'testEmail' })
      );
    });
  });

  describe('ngOnDestroy', () => {
    it('should call next and complete', () => {
      const unsubscribe$Name: any = 'unsubscribe$';
      jest.spyOn(component[unsubscribe$Name], 'next');
      jest.spyOn(component[unsubscribe$Name], 'complete');

      component.ngOnDestroy();

      expect(component[unsubscribe$Name].next).toHaveBeenCalled();
      expect(component[unsubscribe$Name].complete).toHaveBeenCalled();
      expect(SocketService.socket.off).toHaveBeenCalledWith(`refresh-users`);
    });
  });

  describe('ngOnInit', () => {
    it('should call get socket', () => {
      component.ngOnInit();

      expect(SocketService.getSocket).toHaveBeenCalled();
    });
  });
});
