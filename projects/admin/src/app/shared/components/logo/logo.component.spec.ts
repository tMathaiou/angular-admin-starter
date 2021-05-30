import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LogoComponent } from './logo.component';
import { of } from 'rxjs';
import { BreakpointObserver } from '@angular/cdk/layout';
import { RouterTestingModule } from '@angular/router/testing';

describe('LogoComponent', () => {
  let component: LogoComponent;
  let fixture: ComponentFixture<LogoComponent>;
  let breakpointObserver: BreakpointObserver;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LogoComponent],
      imports: [RouterTestingModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LogoComponent);
    component = fixture.componentInstance;
    breakpointObserver = TestBed.inject(BreakpointObserver);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call breakPoint and set isSmallScreen to true', () => {
      jest
        .spyOn(breakpointObserver, 'observe')
        .mockReturnValue(of({ matches: true }) as any);

      component.ngOnInit();

      expect(breakpointObserver.observe).toHaveBeenCalled();
      expect(component.isSmallScreen).toBe(true);
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
