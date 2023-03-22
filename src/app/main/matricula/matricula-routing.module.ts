import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddMatriculaComponent } from './pages/add-matricula/add-matricula.component';
import { ListMatriculaComponent } from './pages/list-matricula/list-matricula.component';
import { MatriculaComponent } from './pages/matricula/matricula.component';

const routes: Routes = [
  {
    path:'', component:MatriculaComponent,
    children:[
      { path:'matriculados', component:ListMatriculaComponent },
      { path:'nueva-matricula', component:AddMatriculaComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MatriculaRoutingModule { }
