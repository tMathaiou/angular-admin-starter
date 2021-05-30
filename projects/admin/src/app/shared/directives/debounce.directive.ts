import { Directive, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Directive({
  selector: '[ngModel][angularAdminDebounce]'
})
export class DebounceDirective implements OnInit {
  @Output() public readonly debounceEvent = new EventEmitter<any>();
  @Input() public readonly debounceTime = 500;

  private isFirstChange = true;

  constructor(public model: NgControl) {}

  public ngOnInit(): void {
    this.model.valueChanges
      .pipe(debounceTime(this.debounceTime), distinctUntilChanged())
      .subscribe((modelValue) => {
        if (this.isFirstChange) {
          this.isFirstChange = false;
        } else {
          this.debounceEvent.emit(modelValue);
        }
      });
  }
}
