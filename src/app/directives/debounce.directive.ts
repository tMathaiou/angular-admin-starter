import {Directive, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NgControl} from '@angular/forms';
import { debounceTime, distinctUntilChanged  } from 'rxjs/operators';

@Directive({
  selector: '[ngModel][app-debounce]',
})
export class DebounceDirective implements OnInit {
  @Output()
  public debounceEvent = new EventEmitter<any>();

  @Input()
  public debounceTime = 500;

  private isFirstChange = true;

  constructor(public model: NgControl) {
  }

  ngOnInit() {
    this.model.valueChanges.pipe(debounceTime(this.debounceTime), distinctUntilChanged())
      .subscribe(modelValue => {
        if (this.isFirstChange) {
          this.isFirstChange = false;
        } else {
          this.debounceEvent.emit(modelValue);
        }
      });
  }
}
