import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ValidateUserGuard } from '../guards/validate-user.guard';
import { AulaComponent } from './pages/aula/aula.component';
import { DocenteComponent } from './pages/Docente/docente/docente.component';
import { MainComponent } from './pages/main/main.component';
import { AddDocenteComponent } from './pages/Docente/add-docente/add-docente.component';
import { ListDocenteComponent } from './pages/Docente/list-docente/list-docente.component';
import { AddCursoComponent } from './pages/Curso/add-curso/add-curso.component';
import { CursoComponent } from './pages/Curso/curso/curso.component';
import { ListCursoComponent } from './pages/Curso/list-curso/list-curso.component';
import { UsuarioComponent } from './pages/Usuario/usuario/usuario.component';
import { AddUsuarioComponent } from './pages/Usuario/add-usuario/add-usuario.component';
import { ListUsuarioComponent } from './pages/Usuario/list-usuario/list-usuario.component';
import { GrupoComponent } from './pages/Grupo/grupo/grupo.component';
import { AddGrupoComponent } from './pages/Grupo/add-grupo/add-grupo.component';
import { ListGrupoComponent } from './pages/Grupo/list-grupo/list-grupo.component';
import { VerGrupoComponent } from './pages/Grupo/ver-grupo/ver-grupo.component';
import { MoreGrupoComponent } from './pages/Grupo/more-grupo/more-grupo.component';
import { PerfilComponent } from './pages/Perfil/perfil/perfil.component';
import { ChatBotComponent } from './pages/Chatbot/chat-bot/chat-bot.component';
import { MatriculaComponent } from './pages/Matricula/matricula/matricula.component';

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
          { path:'editar-docente/:id', component:AddDocenteComponent },
          { path:'lista-docentes', component:ListDocenteComponent },
        ]
      },
      { path:'cursos', component:CursoComponent,
        children:[
          { path:'add-curso', component:AddCursoComponent },
          { path:'editar-curso/:id', component:AddCursoComponent },
          { path:'lista-cursos', component:ListCursoComponent },
        ]
      },
      { path:'grupos', component:GrupoComponent,
        children:[
          { path:'add-grupo', component:AddGrupoComponent },
          { path:'lista-grupos', component:ListGrupoComponent },
          { path:'mas-opciones', component:MoreGrupoComponent },
          { path:'ver-grupo/:id', component:VerGrupoComponent},
        ]
      },
      { path:'matricula', component:MatriculaComponent,
        children:[]
      },
      { path:'chat-bot', component:ChatBotComponent,
        children:[]
      },
      { path:'usuarios', component:UsuarioComponent,
        children:[
          { path:'add-usuario', component: AddUsuarioComponent },
          { path:'editar-usuario/:id', component: AddUsuarioComponent },
          { path:'lista-usuarios', component: ListUsuarioComponent }
        ]
      },
      { path:'perfil', component:PerfilComponent,
        children:[]
      },
      {
        path:'usuario-test',
        loadChildren: () => import('./Usuario/usuario.module').then( mod => mod.UsuarioModule )
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
