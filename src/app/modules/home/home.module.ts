import {NgModule} from '@angular/core';
import {SharedModule} from '../../shared/shared.module';
import {HomeComponent} from './home.component';
import {HomeStartComponent} from './home-start.component';
import {HomeRouting} from './home.routing';


@NgModule({
  imports: [
    HomeRouting,
    SharedModule
  ],
  exports: [
    HomeComponent
  ],
  declarations: [HomeStartComponent, HomeComponent],
  providers: []
})
export class HomeModule {
}
