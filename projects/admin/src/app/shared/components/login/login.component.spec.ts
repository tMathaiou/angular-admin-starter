import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgxsModule, Store } from '@ngxs/store';
import { AppState } from '../../../state/app.state';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrModule } from 'ngx-toastr';
import { LoginUser } from '../../../state/app.actions';

describe('LoginComponent', () => {
  const email = 'test@email.com';
  const password = 'password';
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let store: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [
        ReactiveFormsModule,
        TranslateModule.forRoot(),
        NgxsModule.forRoot([AppState]),
        HttpClientTestingModule,
        RouterTestingModule,
        ToastrModule.forRoot()
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('email', () => {
    it('should have value empty strings', () => {
      expect(component.email.value).toBe('');
    });
    it('should have value test@email.com', () => {
      component.loginForm.get('email').setValue(email);

      expect(component.email.value).toBe(email);
    });
  });

  describe('password', () => {
    it('should have value empty strings', () => {
      expect(component.password.value).toBe('');
    });
    it('should have value password', () => {
      component.loginForm.get('password').setValue(password);

      expect(component.password.value).toBe(password);
    });
  });

  describe('login', () => {
    it('should dispatch new LoginUser', () => {
      jest.spyOn(store, 'dispatch');
      component.email.setValue(email);
      component.password.setValue(password);

      component.login();

      expect(store.dispatch).toHaveBeenCalledWith(
        new LoginUser(email, password)
      );
    });
  });
});
