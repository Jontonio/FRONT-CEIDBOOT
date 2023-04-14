import { NgModule } from '@angular/core';
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
import { registerLocaleData } from "@angular/common";
registerLocaleData(localEs);

const config: SocketIoConfig = { url: environment.BASE_URL, options: {} };

@NgModule({
  declarations: [
    AppComponent
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
    {provide: LOCALE_ID, useValue: 'es-PE' },
    { provide: HTTP_INTERCEPTORS, useClass: TokeInterceptorsService, multi:true },
  ]
})
export class AppModule { }
