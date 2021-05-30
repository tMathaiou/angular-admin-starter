import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RightActionbarComponent } from './right-actionbar.component';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TranslateModule } from '@ngx-translate/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgxsModule, Store } from '@ngxs/store';
import { AppState } from '../../../state/app.state';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrModule } from 'ngx-toastr';
import { of } from 'rxjs';
import { Logout, SetLangID } from '../../../state/app.actions';

describe('RightActionbarComponent', () => {
  let component: RightActionbarComponent;
  let fixture: ComponentFixture<RightActionbarComponent>;
  let store: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RightActionbarComponent],
      imports: [
        MatSelectModule,
        MatFormFieldModule,
        TranslateModule.forRoot(),
        FontAwesomeModule,
        NgxsModule.forRoot([AppState]),
        HttpClientTestingModule,
        RouterTestingModule,
        ToastrModule.forRoot()
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RightActionbarComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should find the language with the ID 0', () => {
      jest.spyOn(component.langID$, 'pipe').mockReturnValue(of(0));

      component.ngOnInit();

      expect(component.selectedLanguage).toStrictEqual({
        imageSrc: '/assets/images/260-united-kingdom.svg',
        path: 'en',
        id: 0,
        text: 'languages.english'
      });
      expect(component.langID$.pipe).toHaveBeenCalled();
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
    });
  });

  describe('setSelectedLanguage', () => {
    it('should dispatch store with SetLangID', () => {
      jest.spyOn(store, 'dispatch');

      component.setSelectedLanguage({ value: 1 });

      expect(store.dispatch).toHaveBeenCalledWith(new SetLangID(1));
    });
  });

  describe('logout', () => {
    it('should dispatch store with Logout', () => {
      jest.spyOn(store, 'dispatch');

      component.logout();

      expect(store.dispatch).toHaveBeenCalledWith(new Logout());
    });
  });
});
