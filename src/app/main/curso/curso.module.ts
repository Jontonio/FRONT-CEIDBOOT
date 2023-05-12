import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CursoRoutingModule } from './curso-routing.module';
import { AddCursoComponent } from './pages/add-curso/add-curso.component';
import { CursoComponent } from './pages/curso/curso.component';
import { ListCursoComponent } from './pages/list-curso/list-curso.component';
import { FormCursoComponent } from './components/form-curso/form-curso.component';
import { ReactiveFormsModule } from '@angular/forms';
import { PrimengModule } from 'src/app/primeng/primeng.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { MaterialModule } from 'src/app/material/material.module';
import { VerCursoComponent } from './pages/ver-curso/ver-curso.component';
import { MainModule } from '../main.module';
import { BuscarCursoPipe } from './pipes/buscar-curso.pipe';


@NgModule({
  declarations: [
    AddCursoComponent,
    CursoComponent,
    ListCursoComponent,
    FormCursoComponent,
    VerCursoComponent,
    BuscarCursoPipe
  ],
  imports: [
    CommonModule,
    CursoRoutingModule,
    ReactiveFormsModule,
    PrimengModule,
    SharedModule,
    MaterialModule,
    MainModule
  ]
})
export class CursoModule { }
