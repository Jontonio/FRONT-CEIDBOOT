import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatriculaRoutingModule } from './matricula-routing.module';
import { MatriculaComponent } from './pages/matricula/matricula.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrimengModule } from 'src/app/primeng/primeng.module';
import { ListMatriculaComponent } from './pages/list-matricula/list-matricula.component';
import { AddMatriculaComponent } from './pages/add-matricula/add-matricula.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from 'src/app/material/material.module';


@NgModule({
  declarations: [
    MatriculaComponent,
    ListMatriculaComponent,
    AddMatriculaComponent,
  ],
  imports: [
    CommonModule,
    MatriculaRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    PrimengModule,
    SharedModule,
    HttpClientModule,
    MaterialModule
  ]
})
export class MatriculaModule { }
