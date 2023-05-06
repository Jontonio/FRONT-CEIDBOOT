import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginComponent } from './pages/login/login.component';
import { PrimengModule } from '../primeng/primeng.module';
import { FormLoginComponent } from './components/form-login/form-login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from "@angular/common/http";
import { FormResetPasswordComponent } from './components/form-reset-password/form-reset-password.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { MaterialModule } from '../material/material.module';
import { SendCheckEmailComponent } from './components/send-check-email/send-check-email.component';
import { AuthRoutingModule } from './auth-routing.module';
import { ChangePasswordComponent } from './pages/change-password/change-password.component';
import { FormChangePasswordComponent } from './components/form-change-password/form-change-password.component';
import { AuthComponent } from './pages/auth/auth.component';
import { RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';

@NgModule({
  declarations: [
    AuthComponent,
    LoginComponent,
    FormLoginComponent,
    FormResetPasswordComponent,
    ResetPasswordComponent,
    SendCheckEmailComponent,
    ChangePasswordComponent,
    FormChangePasswordComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    AuthRoutingModule,
    PrimengModule,
    MaterialModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers:[ MessageService ]
})
export class AuthModule { }
