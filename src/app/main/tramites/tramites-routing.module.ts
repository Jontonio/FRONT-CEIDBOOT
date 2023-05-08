import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TramitesMainComponent } from './pages/tramites-main/tramites-main.component';
import { ListTramitesComponent } from './pages/list-tramites/list-tramites.component';

const routes: Routes = [
  {
    path:'', component:TramitesMainComponent,
    children:[
      { path:'lista-tramites', component:ListTramitesComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TramitesRoutingModule { }
