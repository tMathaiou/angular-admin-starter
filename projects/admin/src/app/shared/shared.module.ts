import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { DebounceDirective } from './directives/debounce.directive';
import { LoaderComponent } from './components/loader/loader.component';
import { LoginComponent } from './components/login/login.component';
import { LogoComponent } from './components/logo/logo.component';
import { MenuSidebarComponent } from './components/menu-sidebar/menu-sidebar.component';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RightActionbarComponent } from './components/right-actionbar/right-actionbar.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { TopBarComponent } from './components/top-bar/top-bar.component';

@NgModule({
  declarations: [
    DebounceDirective,
    LoaderComponent,
    LoginComponent,
    LogoComponent,
    MenuSidebarComponent,
    RightActionbarComponent,
    TopBarComponent
  ],
  imports: [
    TranslateModule,
    PerfectScrollbarModule,
    RouterModule,
    FontAwesomeModule,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule
  ],
  exports: [
    CommonModule,
    DebounceDirective,
    ReactiveFormsModule,
    TranslateModule,
    LoaderComponent,
    LoginComponent,
    LogoComponent,
    MenuSidebarComponent,
    RightActionbarComponent,
    TopBarComponent
  ]
})
export class SharedModule {}
