import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddMatriculaComponent } from './pages/add-matricula/add-matricula.component';
import { ListMatriculaComponent } from './pages/list-matricula/list-matricula.component';
import { MatriculaComponent } from './pages/matricula/matricula.component';
import { MayoriaEdadComponent } from './pages/steps/mayoria-edad/mayoria-edad.component';
import { PersonalInfoComponent } from './pages/steps/personal-info/personal-info.component';

const routes: Routes = [
  {
    path:'', component:MatriculaComponent,
    children:[
      {
        path:'matriculados',
        component:ListMatriculaComponent
      },
      {
        path:'nueva-matricula',
        component:AddMatriculaComponent,
        children:[
          { path:'personal-info', component:PersonalInfoComponent},
          { path:'mayoria-edad', component:MayoriaEdadComponent}
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MatriculaRoutingModule { }
