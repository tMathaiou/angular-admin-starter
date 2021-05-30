import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { ToastrModule } from 'ngx-toastr';
import {
  PERFECT_SCROLLBAR_CONFIG,
  PerfectScrollbarModule
} from 'ngx-perfect-scrollbar';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatSelectModule } from '@angular/material/select';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { registerLocaleData } from '@angular/common';
import localeEn from '@angular/common/locales/en';
import localeEl from '@angular/common/locales/el';
import { CoreModule } from './core/core.module';
import { NgxsModule } from '@ngxs/store';
import { AppState } from './state/app.state';
import { SharedModule } from './shared/shared.module';
import { HomeModule } from './home/home.module';
import { AuthGuard } from './shared/guards/auth.guard';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    FontAwesomeModule,
    SweetAlert2Module.forRoot(),
    ToastrModule.forRoot(),
    PerfectScrollbarModule,
    NgxsModule.forRoot([AppState], {
      selectorOptions: { injectContainerState: false },
      developmentMode: !environment.production
    }),
    HttpClientModule,
    MatSelectModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (http: HttpClient) =>
          new TranslateHttpLoader(http, './../assets/i18n/', '.json'),
        deps: [HttpClient]
      }
    }),
    AppRoutingModule,
    CoreModule,
    SharedModule,
    HomeModule
  ],
  providers: [
    {
      provide: LOCALE_ID,
      useFactory: () => {
        const lang = localStorage.getItem('language');
        registerLocaleData(lang === 'el' ? localeEl : localeEn);
        return lang;
      }
    },
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: {
        suppressScrollX: true
      }
    },
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
