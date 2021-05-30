import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { BreakpointObserver } from '@angular/cdk/layout';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { SharedModule } from './shared/shared.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;
  let breakpointObserver: BreakpointObserver;
  let translateService: TranslateService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        FontAwesomeModule,
        HttpClientTestingModule,
        SharedModule,
        TranslateModule.forRoot()
      ],
      declarations: [AppComponent],
      providers: []
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    breakpointObserver = TestBed.inject(BreakpointObserver);
    translateService = TestBed.inject(TranslateService);
    router = TestBed.inject(Router);
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      jest.spyOn(router, 'navigateByUrl').mockImplementation(() => null);
      jest
        .spyOn(breakpointObserver, 'observe')
        .mockReturnValue(of({ matches: true }) as any);
    });
    it('should call breakPoint and set isSmallScreen to true', () => {
      component.ngOnInit();

      expect(breakpointObserver.observe).toHaveBeenCalled();
      expect(component.isSmallScreen).toBe(true);
    });

    it('should call routes.events with url /', () => {
      jest
        .spyOn(router.events, 'pipe')
        .mockReturnValue(of({ url: '/' }) as any);

      component.ngOnInit();

      expect(router.events.pipe).toHaveBeenCalled();
      expect(router.navigateByUrl).toHaveBeenCalledWith('/view');
    });

    it('should call routes.events with url other than /', () => {
      jest
        .spyOn(router.events, 'pipe')
        .mockReturnValue(of({ url: '/view' }) as any);

      component.ngOnInit();

      expect(router.events.pipe).toHaveBeenCalled();
      expect(router.navigateByUrl).not.toHaveBeenCalled();
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
