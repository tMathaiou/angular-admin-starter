import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {DebounceDirective} from '../directives/debounce.directive';


@NgModule({
  declarations: [DebounceDirective],
  exports: [
    DebounceDirective,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    TranslateModule
  ]
})
export class SharedModule {
}
