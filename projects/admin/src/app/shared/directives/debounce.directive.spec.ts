import { Component } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick
} from '@angular/core/testing';
import { DebounceDirective } from './debounce.directive';
import { By } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'angular-admin-test-component',
  template: `<input
    angularAdminDebounce
    [debounceTime]="500"
    (debounceEvent)="someEvent()"
    class="my-input"
    [(ngModel)]="value"
  />`
})
class TestComponent {
  public value = '';

  public someEvent(): void {
    console.log('called some event');
  }
}

describe('DebounceDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestComponent, DebounceDirective],
      imports: [FormsModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
  });

  describe('angularAdminDebounce', () => {
    it('should change the value', fakeAsync(() => {
      fixture.detectChanges();
      tick();
      jest.spyOn(component, 'someEvent');
      const { nativeElement }: { nativeElement: HTMLInputElement } =
        fixture.debugElement.query(By.css('.my-input'));

      nativeElement.value = 'test';
      nativeElement.dispatchEvent(new Event('input'));

      tick(501);
      expect(component.someEvent).not.toHaveBeenCalled();

      nativeElement.value = 'test2';
      nativeElement.dispatchEvent(new Event('input'));

      tick(501);
      expect(component.someEvent).toHaveBeenCalled();
    }));
  });
});
