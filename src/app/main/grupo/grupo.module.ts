import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GrupoRoutingModule } from './grupo-routing.module';
import { AddGrupoComponent } from './pages/add-grupo/add-grupo.component';
import { GrupoComponent } from './pages/grupo/grupo.component';
import { ListGrupoComponent } from './pages/list-grupo/list-grupo.component';
import { MoreGrupoComponent } from './pages/more-grupo/more-grupo.component';
import { VerGrupoComponent } from './pages/ver-grupo/ver-grupo.component';
import { ReactiveFormsModule } from '@angular/forms';
import { PrimengModule } from 'src/app/primeng/primeng.module';
import { ModalHorarioComponent } from './components/modal-horario/modal-horario.component';
import { ModalTipoGrupoComponent } from './components/modal-tipo-grupo/modal-tipo-grupo.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    AddGrupoComponent,
    GrupoComponent,
    ListGrupoComponent,
    MoreGrupoComponent,
    VerGrupoComponent,
    ModalHorarioComponent,
    ModalTipoGrupoComponent
  ],
  imports: [
    CommonModule,
    GrupoRoutingModule,
    ReactiveFormsModule,
    PrimengModule,
    SharedModule
  ]
})
export class GrupoModule { }
