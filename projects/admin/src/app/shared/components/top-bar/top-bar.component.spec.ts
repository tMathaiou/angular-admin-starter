import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AppState } from '../../../state/app.state';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrModule } from 'ngx-toastr';
import { TopBarComponent } from './top-bar.component';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { LogoComponent } from '../logo/logo.component';
import { RightActionbarComponent } from '../right-actionbar/right-actionbar.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RouterExtended } from '../../interfaces/router-extended';
import { ToggleSidebar } from '../../../state/app.actions';

describe('TopBarComponent', () => {
  let component: TopBarComponent;
  let fixture: ComponentFixture<TopBarComponent>;
  let store: Store;
  let router: Router;
  let translateService: TranslateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TopBarComponent, LogoComponent, RightActionbarComponent],
      imports: [
        TranslateModule.forRoot(),
        NgxsModule.forRoot([AppState]),
        FontAwesomeModule,
        MatSelectModule,
        MatFormFieldModule,
        HttpClientTestingModule,
        RouterTestingModule,
        ToastrModule.forRoot()
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopBarComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    router = TestBed.inject(Router);
    translateService = TestBed.inject(TranslateService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call setCurrentPage twice', () => {
      jest.spyOn(component, 'setCurrentPage');
      jest.spyOn(router.events, 'pipe').mockReturnValue(of({}));
      jest.spyOn(translateService.onLangChange, 'pipe').mockReturnValue(of({}));

      component.ngOnInit();

      expect(router.events.pipe).toHaveBeenCalled();
      expect(translateService.onLangChange.pipe).toHaveBeenCalled();
      expect(component.setCurrentPage).toHaveBeenCalledTimes(2);
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

  describe('setCurrentPage', () => {
    const currentUrlTreeName: any = 'currentUrlTree';
    beforeEach(() => {
      jest.spyOn(router.events, 'pipe').mockReturnValue(of({}));
      router.config = [
        {
          urlPath: '/',
          name: 'Home'
        },
        {
          urlPath: '/view',
          name: 'View'
        }
      ] as RouterExtended[];
    });

    it('should set current page to menu.Home', () => {
      router[currentUrlTreeName] = router.parseUrl('/');

      component.ngOnInit();

      expect(router.events.pipe).toHaveBeenCalled();
      expect(component.currentPage).toBe('menu.Home');
    });

    it('should set current page to menu.View', () => {
      router[currentUrlTreeName] = router.parseUrl('/view');

      component.ngOnInit();

      expect(router.events.pipe).toHaveBeenCalled();
      expect(component.currentPage).toBe('menu.View');
    });
  });

  describe('toggleSidebar', () => {
    it('should dispatch store with ToggleSidebar', () => {
      jest.spyOn(store, 'dispatch');

      component.toggleSidebar();

      expect(store.dispatch).toHaveBeenCalledWith(new ToggleSidebar());
    });
  });
});
