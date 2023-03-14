import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddDocenteComponent } from './pages/add-docente/add-docente.component';
import { DocenteComponent } from './pages/docente/docente.component';
import { ListDocenteComponent } from './pages/list-docente/list-docente.component';

const routes: Routes = [
  {
    path:'',
    component:DocenteComponent,
    children:[
      { path:'add-docente', component:AddDocenteComponent },
      { path:'editar-docente/:id', component:AddDocenteComponent },
      { path:'lista-docentes', component:ListDocenteComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DocenteRoutingModule { }
