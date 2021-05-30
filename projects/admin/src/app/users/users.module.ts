import { NgModule } from '@angular/core';
import { UsersRouting } from './users.routing';
import { UsersComponent } from './users.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { UsersService } from './users.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { UsersFormComponent } from './user-form/users-form.component';
import { SharedModule } from '../shared/shared.module';
import { UsersRouterComponent } from './users.router.component';
import { FormsModule } from '@angular/forms';
import { NgxsModule } from '@ngxs/store';
import { UserState } from './state/user.state';

@NgModule({
  imports: [
    UsersRouting,
    SharedModule,
    FontAwesomeModule,
    NgxPaginationModule,
    SweetAlert2Module,
    FormsModule,
    NgxsModule.forFeature([UserState])
  ],
  exports: [UsersComponent, UsersFormComponent],
  declarations: [UsersRouterComponent, UsersComponent, UsersFormComponent],
  providers: [UsersService]
})
export class UsersModule {}
