import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PerfilRoutingModule } from './perfil-routing.module';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { PrimengModule } from 'src/app/primeng/primeng.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from 'src/app/material/material.module';


@NgModule({
  declarations: [
    PerfilComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PerfilRoutingModule,
    PrimengModule,
    HttpClientModule,
    MaterialModule
  ]
})
export class PerfilModule { }
