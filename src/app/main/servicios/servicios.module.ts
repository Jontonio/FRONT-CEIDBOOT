import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ServiciosRoutingModule } from './servicios-routing.module';
import { ServiciosComponent } from './pages/servicios/servicios.component';
import { DenominServicioComponent } from './pages/denomin-servicio/denomin-servicio.component';


@NgModule({
  declarations: [
    ServiciosComponent,
    DenominServicioComponent
  ],
  imports: [
    CommonModule,
    ServiciosRoutingModule
  ]
})
export class ServiciosModule { }
