import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ValidateUserGuard } from '../guards/validate-user.guard';
import { AulaComponent } from './pages/aula/aula.component';
import { MainComponent } from './pages/main/main.component';
import { PerfilComponent } from './pages/Perfil/perfil/perfil.component';
import { ChatBotComponent } from './pages/Chatbot/chat-bot/chat-bot.component';

const routes: Routes = [
  {
    path:'',
    component:MainComponent,
    canActivate:[ValidateUserGuard],
    children:[
      {
        path:'aulas', component:AulaComponent },
      {
        path:'docentes',
        loadChildren: () => import('./docente/docente.module').then( mod => mod.DocenteModule )
      },
      {
        path:'cursos',
        loadChildren: () => import('./curso/curso.module').then( mod => mod.CursoModule )
      },
      {
        path:'grupos',
        loadChildren: () => import('./grupo/grupo.module').then( mod => mod.GrupoModule )
      },
      {
        path:'matricula',
        loadChildren: () => import('./matricula/matricula.module').then( mod => mod.MatriculaModule )
      },
      {
        path:'chat-bot', component:ChatBotComponent,
        children:[]
      },
      {

        path:'usuarios',
        loadChildren: () => import('./usuario/usuario.module').then( mod => mod.UsuarioModule )
      },
      {
        path:'perfil', component:PerfilComponent,
        children:[]
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
