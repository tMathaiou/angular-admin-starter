import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoaderComponent } from './loader.component';

describe('LoaderComponent', () => {
  let component: LoaderComponent;
  let fixture: ComponentFixture<LoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoaderComponent],
      imports: []
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoaderComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.spinnerDelay1).toStrictEqual({ animationDelay: '0.1s' });
    expect(component.spinnerDelay2).toStrictEqual({ animationDelay: '0.2s' });
    expect(component.spinnerDelay3).toStrictEqual({ animationDelay: '0.3s' });
    expect(component.spinnerDelay4).toStrictEqual({ animationDelay: '0.4s' });
    expect(component.spinnerDelay5).toStrictEqual({ animationDelay: '0.5s' });
  });
});
