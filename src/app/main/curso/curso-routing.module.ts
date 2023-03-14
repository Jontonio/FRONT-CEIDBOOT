import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddCursoComponent } from './pages/add-curso/add-curso.component';
import { ListCursoComponent } from './pages/list-curso/list-curso.component';

const routes: Routes = [
  { path:'',
    children:[
      { path:'add-curso', component:AddCursoComponent },
      { path:'editar-curso/:id', component:AddCursoComponent },
      { path:'lista-cursos', component:ListCursoComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CursoRoutingModule { }
