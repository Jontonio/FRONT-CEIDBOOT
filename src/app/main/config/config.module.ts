import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfigRoutingModule } from './config-routing.module';
import { MainConfigComponent } from './pages/main-config/main-config.component';
import { ChildrenMainComponent } from './pages/children-main/children-main.component';
import { PrimengModule } from 'src/app/primeng/primeng.module';
import { MaterialModule } from 'src/app/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { MainModule } from '../main.module';

@NgModule({
  declarations: [
    MainConfigComponent,
    ChildrenMainComponent,
  ],
  imports: [
    CommonModule,
    PrimengModule,
    MaterialModule,
    HttpClientModule,
    SharedModule,
    ReactiveFormsModule,
    ConfigRoutingModule,
    MainModule
  ]
})
export class ConfigModule { }
