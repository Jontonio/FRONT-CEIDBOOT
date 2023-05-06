import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GrupoRoutingModule } from './grupo-routing.module';
import { AddGrupoComponent } from './pages/add-grupo/add-grupo.component';
import { GrupoComponent } from './pages/grupo/grupo.component';
import { ListGrupoComponent } from './pages/list-grupo/list-grupo.component';
import { VerGrupoComponent } from './pages/ver-grupo/ver-grupo.component';
import { ReactiveFormsModule } from '@angular/forms';
import { PrimengModule } from 'src/app/primeng/primeng.module';
import { ModalHorarioComponent } from './components/modal-horario/modal-horario.component';
import { ModalTipoGrupoComponent } from './components/modal-tipo-grupo/modal-tipo-grupo.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MaterialModule } from 'src/app/material/material.module';
import { FormGrupoComponent } from './components/form-grupo/form-grupo.component';
import { EstudiantesGrupoComponent } from './pages/estudiantes-grupo/estudiantes-grupo.component';
import { NgxSpinnerModule } from "ngx-spinner";
import { EmptyDataPipe } from 'src/app/pipes/empty-data.pipe';
import { ModalMensualidadComponent } from './components/modal-mensualidad/modal-mensualidad.component';
import { FilterPagoPipe } from './pipes/filter-pago.pipe';
import { BuscarEstudiantePipe } from './pipes/buscar-estudiante.pipe';
import { FilterStatusGrupoPipe } from './pipes/filter-status-grupo.pipe';
import { FilterGrupoPipe } from './pipes/filter-grupo.pipe';
import { InfoEstudianteComponent } from './pages/info-estudiante/info-estudiante.component';
import { ChatBotModule } from '../chat-bot/chat-bot.module';
import { NgxChartsModule } from '@swimlane/ngx-charts';


@NgModule({
  declarations: [
    AddGrupoComponent,
    GrupoComponent,
    ListGrupoComponent,
    VerGrupoComponent,
    ModalHorarioComponent,
    ModalTipoGrupoComponent,
    FormGrupoComponent,
    EstudiantesGrupoComponent,
    EmptyDataPipe,
    ModalMensualidadComponent,
    FilterPagoPipe,
    BuscarEstudiantePipe,
    FilterStatusGrupoPipe,
    FilterGrupoPipe,
    InfoEstudianteComponent,
  ],
  imports: [
    CommonModule,
    GrupoRoutingModule,
    ReactiveFormsModule,
    PrimengModule,
    MaterialModule,
    SharedModule,
    NgxSpinnerModule,
    ChatBotModule,
    NgxChartsModule
  ]
})
export class GrupoModule { }
