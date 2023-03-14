import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { LoginComponent } from './pages/login/login.component';
import { PrimengModule } from '../primeng/primeng.module';
import { FormLoginComponent } from './components/form-login/form-login.component';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { TokeInterceptorsService } from '../interceptors/token-interceptors.service';

@NgModule({
  declarations: [
    LoginComponent,
    FormLoginComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    PrimengModule,
    SharedModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  exports:[
    LoginComponent
  ]
})
export class AuthModule { }
