import {NgModule} from '@angular/core';
import {SharedModule} from '../../shared/shared.module';
import {UsersRouting} from './users.routing';
import {UsersComponent} from './users.component';
import {UsersStartComponent} from './users-start.component';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {SweetAlert2Module} from '@sweetalert2/ngx-sweetalert2';
import {UsersService} from './users.service';
import {NgxPaginationModule} from 'ngx-pagination';
import {UsersFormComponent} from './users-form.component';



@NgModule({
  imports: [
    UsersRouting,
    SharedModule,
    FontAwesomeModule,
    NgxPaginationModule,
    SweetAlert2Module
  ],
  exports: [
    UsersComponent,
    UsersFormComponent
  ],
  declarations: [UsersStartComponent, UsersComponent, UsersFormComponent],
  providers: [UsersService]
})
export class UsersModule {
}
