import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ServiciosComponent } from './pages/servicios/servicios.component';
import { DenominServicioComponent } from './pages/denomin-servicio/denomin-servicio.component';

const routes: Routes = [
  {
    path:'', component:ServiciosComponent,
    children:[
      { path:'tipo-poblacion', component:DenominServicioComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ServiciosRoutingModule { }
