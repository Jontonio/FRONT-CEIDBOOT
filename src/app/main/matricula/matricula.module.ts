import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatriculaRoutingModule } from './matricula-routing.module';
import { MatriculaComponent } from './pages/matricula/matricula.component';
import { ReactiveFormsModule } from '@angular/forms';
import { PrimengModule } from 'src/app/primeng/primeng.module';
import { ListMatriculaComponent } from './pages/list-matricula/list-matricula.component';
import { AddMatriculaComponent } from './pages/add-matricula/add-matricula.component';
import { PersonalInfoComponent } from './pages/steps/personal-info/personal-info.component';
import { MayoriaEdadComponent } from './pages/steps/mayoria-edad/mayoria-edad.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [
    MatriculaComponent,
    ListMatriculaComponent,
    AddMatriculaComponent,
    PersonalInfoComponent,
    MayoriaEdadComponent
  ],
  imports: [
    CommonModule,
    MatriculaRoutingModule,
    ReactiveFormsModule,
    PrimengModule,
    SharedModule,
    HttpClientModule
  ]
})
export class MatriculaModule { }
