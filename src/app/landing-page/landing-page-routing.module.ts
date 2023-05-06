import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { MainComponent } from './pages/main/main.component';
import { MatriculaComponent } from './pages/matricula/matricula.component';
import { WeComponent } from './pages/we/we.component';
import { PagosComponent } from './pages/pagos/pagos.component';
import { ExampleNumOperacionComponent } from './pages/example-num-operacion/example-num-operacion.component';
import { ExamenSuficienciaComponent } from './pages/examen-suficiencia/examen-suficiencia.component';
import { OtrosTramitesComponent } from './pages/otros-tramites/otros-tramites.component';
import { CertificadoEstudiosComponent } from './pages/certificado-estudios/certificado-estudios.component';

const routes: Routes = [
  {
    path:'',
    component:MainComponent,
    children:[
      { path:'home', component:HomeComponent },
      { path:'nosotros', component:WeComponent },
      { path:'matricula', component:MatriculaComponent },
      { path:'pagos', component:PagosComponent },
      { path:'otros-tramites', component:OtrosTramitesComponent },
      { path:'examen-suficiencia', component:ExamenSuficienciaComponent },
      { path:'certificado-de-estudios', component:CertificadoEstudiosComponent },
      { path:'example/numero-operacion', component:ExampleNumOperacionComponent },
    ]
  },
  {
    path:'**', redirectTo:'main/home'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LandingPageRoutingModule { }
