import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddGrupoComponent } from './pages/add-grupo/add-grupo.component';
import { GrupoComponent } from './pages/grupo/grupo.component';
import { ListGrupoComponent } from './pages/list-grupo/list-grupo.component';
import { MoreGrupoComponent } from './pages/more-grupo/more-grupo.component';
import { VerGrupoComponent } from './pages/ver-grupo/ver-grupo.component';

const routes: Routes = [
  {
    path:'',
    component:GrupoComponent,
    children:[
      { path:'add-grupo', component:AddGrupoComponent },
      { path:'lista-grupos', component:ListGrupoComponent },
      { path:'mas-opciones', component:MoreGrupoComponent },
      { path:'ver-grupo/:id', component:VerGrupoComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GrupoRoutingModule { }
