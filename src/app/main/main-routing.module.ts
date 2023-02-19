import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ValidateUserGuard } from '../guards/validate-user.guard';
import { AulaComponent } from './pages/aula/aula.component';
import { CursoComponent } from './pages/curso/curso.component';
import { DocenteComponent } from './pages/docente/docente.component';
import { MainComponent } from './pages/main/main.component';
import { UsuarioComponent } from './pages/usuario/usuario.component';

const routes: Routes = [
  {
    path:'',
    component:MainComponent,
    canActivate:[ValidateUserGuard],
    children:[
      { path:'aulas', component:AulaComponent },
      { path:'cursos', component:CursoComponent },
      { path:'docentes', component:DocenteComponent },
      // { path:'docentes', component:DocenteComponent },
      { path:'usuarios', component:UsuarioComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
