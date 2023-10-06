import { NgModule, CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { environment } from 'src/environments/environment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokeInterceptorsService } from './interceptors/token-interceptors.service';
import { LOCALE_ID } from '@angular/core';

import localEs from "@angular/common/locales/es-PE";
import { HashLocationStrategy, LocationStrategy, registerLocaleData } from "@angular/common";
import { UnauthorizedPageComponent } from './pages/unauthorized-page/unauthorized-page.component';

registerLocaleData(localEs);

const config: SocketIoConfig = { url: environment.URL_SOCKET, options: {} };

@NgModule({
  declarations: [
    AppComponent,
    UnauthorizedPageComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SocketIoModule.forRoot(config),
    BrowserAnimationsModule,
    HttpClientModule
  ],
  bootstrap: [AppComponent],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    { provide: LOCALE_ID, useValue: 'es-PE' },
    { provide: HTTP_INTERCEPTORS, useClass: TokeInterceptorsService, multi:true },
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]

})
export class AppModule { }
