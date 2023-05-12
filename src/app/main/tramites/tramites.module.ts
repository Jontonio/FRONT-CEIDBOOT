import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TramitesRoutingModule } from './tramites-routing.module';
import { TramitesMainComponent } from './pages/tramites-main/tramites-main.component';
import { ListTramitesComponent } from './pages/list-tramites/list-tramites.component';
import { PrimengModule } from 'src/app/primeng/primeng.module';
import { MaterialModule } from 'src/app/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from 'src/app/shared/shared.module';
import { GrupoModule } from '../grupo/grupo.module';
import { MainModule } from '../main.module';
import { BusquedaEstudianteTramitePipe } from './pipes/busqueda-estudiante-tramite.pipe';


@NgModule({
  declarations: [
    TramitesMainComponent,
    ListTramitesComponent,
    BusquedaEstudianteTramitePipe
  ],
  imports: [
    CommonModule,
    PrimengModule,
    MaterialModule,
    HttpClientModule,
    ReactiveFormsModule,
    TramitesRoutingModule,
    SharedModule,
    GrupoModule,
    MainModule
  ]
})
export class TramitesModule { }
