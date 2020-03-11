import {BrowserModule} from '@angular/platform-browser';
import {LOCALE_ID, NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {MenuSidebarComponent} from './components/menu-sidebar/menu-sidebar.component';
// @ts-ignore
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {RouterModule} from '@angular/router';
import {PerfectScrollbarModule} from 'ngx-perfect-scrollbar';
import {routing} from './app.routing.module';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from '@angular/common/http';
import {registerLocaleData} from '@angular/common';
import localeEn from '@angular/common/locales/en';
import localeEl from '@angular/common/locales/el';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {HomeModule} from './modules/home/home.module';
import {TopBarComponent} from './components/top-bar/top-bar.component';
import {LogoComponent} from './components/logo/logo.component';
import {RightActionbarComponent} from './components/right-actionbar/right-actionbar.component';
import {MatSelectModule} from '@angular/material/select';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {SweetAlert2Module} from '@sweetalert2/ngx-sweetalert2';
import {ToastrModule} from 'ngx-toastr';
import {AuthService} from './services/auth.service';
import {LoginComponent} from './components/login/login.component';
import {FormsModule} from '@angular/forms';
import {AuthGuard} from './shared/auth.guard';
import {ErrorInterceptor} from './shared/http.interceptor';
import {LoaderComponent} from './components/loader/loader.component';
import {NgxsModule} from '@ngxs/store';
import {NgxsLoggerPluginModule} from '@ngxs/logger-plugin';
import {NgxsReduxDevtoolsPluginModule} from '@ngxs/devtools-plugin';
import {AppState} from './store/state';


export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, './../assets/i18n/', '.json');
}

registerLocaleData(localeEn);

export function getCulture(): string {
  if (localStorage.getItem('language') === 'el') {
    registerLocaleData(localeEl);
  } else {
    registerLocaleData(localeEn);
  }

  return localStorage.getItem('language') || 'en';
}

@NgModule({
  declarations: [
    AppComponent,
    MenuSidebarComponent,
    TopBarComponent,
    LogoComponent,
    LoginComponent,
    LoaderComponent,
    RightActionbarComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    FontAwesomeModule,
    SweetAlert2Module.forRoot(),
    NgxsModule.forRoot([AppState]),
    NgxsReduxDevtoolsPluginModule.forRoot(),
    NgxsLoggerPluginModule.forRoot(),
    ToastrModule.forRoot(),
    RouterModule,
    PerfectScrollbarModule,
    HttpClientModule,
    MatSelectModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    routing,
    HomeModule,
    FormsModule
  ],
  providers: [
    {provide: LOCALE_ID, useFactory: getCulture},
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    },
    AuthGuard,
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}


