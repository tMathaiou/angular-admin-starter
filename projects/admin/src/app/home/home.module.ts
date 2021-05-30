import { NgModule } from '@angular/core';
import { HomeComponent } from './home.component';
import { SharedModule } from '../shared/shared.module';
import { HomeRouterComponent } from './home.router.component';
import { HomeRouting } from './home.routing';

@NgModule({
  declarations: [HomeComponent, HomeRouterComponent],
  imports: [SharedModule, HomeRouting]
})
export class HomeModule {}
