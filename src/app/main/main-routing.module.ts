import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ValidateUserGuard } from '../guards/validate-user.guard';
import { MainComponent } from './pages/main/main.component';
import { HasRoleGuard } from '../guards/has-role.guard';
import { WelcomeComponent } from './pages/welcome/welcome.component';

const routes: Routes = [
  {
    path:'',
    component: MainComponent,
    canActivate:[ValidateUserGuard],
    children:[
      {
        path:'welcome',
        canActivate:[HasRoleGuard],
        data:{
          rolesPermitidos:['admin_role','user_role','viewer_role','supervisor_role']
        },
        component:WelcomeComponent
      },
      {
        path:'dashboard',
        canActivate:[HasRoleGuard],
        data:{
          rolesPermitidos:['admin_role','supervisor_role']
        },
        loadChildren: () => import('./dashboard/dashboard.module').then( mod => mod.DashboardModule )
      },
      {
        path:'docentes',
        canActivate:[HasRoleGuard],
        data:{
          rolesPermitidos:['admin_role','user_role','supervisor_role']
        },
        loadChildren: () => import('./docente/docente.module').then( mod => mod.DocenteModule )
      },
      {
        path:'cursos',
        canActivate:[HasRoleGuard],
        data:{
          rolesPermitidos:['admin_role','user_role','supervisor_role']
        },
        loadChildren: () => import('./curso/curso.module').then( mod => mod.CursoModule )
      },
      {
        path:'grupos',
        canActivate:[HasRoleGuard],
        data:{
          rolesPermitidos:['admin_role','user_role','supervisor_role']
        },
        loadChildren: () => import('./grupo/grupo.module').then( mod => mod.GrupoModule )
      },
      {
        path:'matricula',
        canActivate:[HasRoleGuard],
        data:{
          rolesPermitidos:['admin_role','user_role','supervisor_role']
        },
        loadChildren: () => import('./matricula/matricula.module').then( mod => mod.MatriculaModule )
      },
      {
        path:'tramite',
        canActivate:[HasRoleGuard],
        data:{
          rolesPermitidos:['admin_role','user_role','supervisor_role']
        },
        loadChildren: () => import('./tramites/tramites.module').then( mod => mod.TramitesModule )
      },
      {
        path:'chat-bot',
        canActivate:[HasRoleGuard],
        data:{
          rolesPermitidos:['admin_role','user_role','supervisor_role']
        },
        loadChildren: () => import('./chat-bot/chat-bot.module').then( mod => mod.ChatBotModule )
      },
      {
        canActivate:[HasRoleGuard],
        data:{
          rolesPermitidos:['admin_role','supervisor_role']
        },
        path:'config',
        loadChildren: () => import('./config/config.module').then( mod => mod.ConfigModule )
      },
      {

        path:'usuarios',
        canActivate:[HasRoleGuard],
        data:{
          rolesPermitidos:['admin_role','supervisor_role']
        },
        loadChildren: () => import('./usuario/usuario.module').then( mod => mod.usuarioModule )
      },
      {
        path:'perfil',
        canActivate:[HasRoleGuard],
        data:{
          rolesPermitidos:['admin_role','user_role','viewer_role','supervisor_role']
        },
        loadChildren: () => import('./perfil/perfil.module').then( mod => mod.PerfilModule )
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
