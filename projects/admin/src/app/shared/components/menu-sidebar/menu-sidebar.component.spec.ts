import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BreakpointObserver } from '@angular/cdk/layout';
import { TranslateModule } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { of } from 'rxjs';
import { MenuSidebarComponent } from './menu-sidebar.component';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { RouterExtended } from '../../interfaces/router-extended';

describe('MenuSidebarComponent', () => {
  const routerConfig = [
    {
      urlPath: '/',
      name: 'Home'
    },
    {
      urlPath: '/view',
      name: 'View'
    }
  ] as RouterExtended[];
  let fixture: ComponentFixture<MenuSidebarComponent>;
  let component: MenuSidebarComponent;
  let breakpointObserver: BreakpointObserver;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        FontAwesomeModule,
        TranslateModule.forRoot(),
        PerfectScrollbarModule
      ],
      declarations: [MenuSidebarComponent],
      providers: []
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuSidebarComponent);
    component = fixture.componentInstance;
    breakpointObserver = TestBed.inject(BreakpointObserver);
    router = TestBed.inject(Router);
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    const currentUrlTreeName: any = 'currentUrlTree';
    beforeEach(() => {
      jest
        .spyOn(breakpointObserver, 'observe')
        .mockReturnValue(of({ matches: true }) as any);
      jest.spyOn(router.events, 'pipe').mockReturnValue(of({}));
      router.config = routerConfig;
    });
    it('should call breakPoint and set isSmallScreen to true', () => {
      component.ngOnInit();

      expect(breakpointObserver.observe).toHaveBeenCalled();
      expect(component.isSmallScreen).toBe(true);
    });

    it('should call routes.events with current page Home', () => {
      router[currentUrlTreeName] = router.parseUrl('/');

      component.ngOnInit();

      expect(router.events.pipe).toHaveBeenCalled();
      expect(component.currentPage).toBe('Home');
    });

    it('should call routes.events and cannot find the current page', () => {
      router[currentUrlTreeName] = router.parseUrl('/some-other-place');

      component.ngOnInit();

      expect(router.events.pipe).toHaveBeenCalled();
      expect(component.currentPage).toBe('');
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
});
