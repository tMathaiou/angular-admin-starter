import { NgModule } from '@angular/core';
import { HttpExtendInterceptor } from '../shared/interceptors/http.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

@NgModule({
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpExtendInterceptor,
      multi: true
    }
  ]
})
export class CoreModule {}
