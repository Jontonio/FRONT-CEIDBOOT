import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ValidateUserGuard } from '../guards/validate-user.guard';
import { AulaComponent } from './pages/aula/aula.component';
import { DocenteComponent } from './pages/Docente/docente/docente.component';
import { MainComponent } from './pages/main/main.component';
import { AddDocenteComponent } from './pages/Docente/add-docente/add-docente.component';
import { ListDocenteComponent } from './pages/Docente/list-docente/list-docente.component';
import { AddCursoComponent } from './pages/Cursos/add-curso/add-curso.component';
import { CursoComponent } from './pages/Cursos/curso/curso.component';
import { ListCursoComponent } from './pages/Cursos/list-curso/list-curso.component';
import { UsuarioComponent } from './pages/usuarios/usuario/usuario.component';
import { AddUsuarioComponent } from './pages/usuarios/add-usuario/add-usuario.component';
import { ListUsuarioComponent } from './pages/usuarios/list-usuario/list-usuario.component';
import { GrupoComponent } from './pages/grupos/grupo/grupo.component';

const routes: Routes = [
  {
    path:'',
    component:MainComponent,
    canActivate:[ValidateUserGuard],
    children:[
      { path:'aulas', component:AulaComponent },
      { path:'docentes', component:DocenteComponent,
        children:[
          { path:'add-docente', component:AddDocenteComponent },
          { path:'lista-docentes', component:ListDocenteComponent },
        ]
      },
      { path:'cursos', component:CursoComponent,
        children:[
          { path:'add-curso', component:AddCursoComponent },
          { path:'lista-cursos', component:ListCursoComponent },
        ]
      },
      { path:'grupos', component:GrupoComponent,
        children:[
          { path:'add-curso', component:AddCursoComponent },
          { path:'lista-cursos', component:ListCursoComponent },
        ]
      },
      { path:'usuarios', component:UsuarioComponent,
        children:[
          { path:'add-usuario', component: AddUsuarioComponent },
          { path:'editar-usuario/:id', component: AddUsuarioComponent },
          { path:'lista-usuarios', component: ListUsuarioComponent }
        ]
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
