import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DocenteRoutingModule } from './docente-routing.module';
import { FormDocenteComponent } from './components/form-docente/form-docente.component';
import { ListDocenteComponent } from './pages/list-docente/list-docente.component';
import { AddDocenteComponent } from './pages/add-docente/add-docente.component';
import { PrimengModule } from 'src/app/primeng/primeng.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { DocenteComponent } from './pages/docente/docente.component';
import { MaterialModule } from 'src/app/material/material.module';
import { MainModule } from '../main.module';
import { BuscarDocentePipe } from './pipes/buscar-docente.pipe';


@NgModule({
  declarations: [
    DocenteComponent,
    FormDocenteComponent,
    ListDocenteComponent,
    AddDocenteComponent,
    BuscarDocentePipe
  ],
  imports: [
    CommonModule,
    PrimengModule,
    SharedModule,
    ReactiveFormsModule,
    DocenteRoutingModule,
    MaterialModule,
    MainModule
  ]
})
export class DocenteModule { }
