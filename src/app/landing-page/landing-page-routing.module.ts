import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from '../auth/pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { MainComponent } from './pages/main/main.component';
import { MatriculaComponent } from './pages/matricula/matricula.component';
import { WeComponent } from './pages/we/we.component';
import { PagosComponent } from './pages/pagos/pagos.component';

const routes: Routes = [
  {
    path:'',
    component:MainComponent,
    children:[
      { path:'home', component:HomeComponent },
      { path:'nosotros', component:WeComponent },
      { path:'matricula', component:MatriculaComponent },
      { path:'pagos', component:PagosComponent },
      { path:'auth/login', component:LoginComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LandingPageRoutingModule { }
