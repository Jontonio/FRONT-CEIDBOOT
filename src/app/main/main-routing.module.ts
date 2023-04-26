import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ValidateUserGuard } from '../guards/validate-user.guard';
import { MainComponent } from './pages/main/main.component';
import { ChatBotComponent } from './chat-bot/pages/chat-bot/chat-bot.component';
import { HasRoleGuard } from '../guards/has-role.guard';

const routes: Routes = [
  {
    path:'',
    component:MainComponent,
    canActivate:[ValidateUserGuard],
    children:[
      {
        path:'dashboard',
        canActivate:[HasRoleGuard],
        data:{
          rolesPermitidos:['admin_role']
        },
        loadChildren: () => import('./dashboard/dashboard.module').then( mod => mod.DashboardModule )
      },
      {
        path:'docentes',
        canActivate:[HasRoleGuard],
        data:{
          rolesPermitidos:['admin_role','user_role']
        },
        loadChildren: () => import('./docente/docente.module').then( mod => mod.DocenteModule )
      },
      {
        path:'nuestros-servicios',
        canActivate:[HasRoleGuard],
        data:{
          rolesPermitidos:['admin_role','user_role']
        },
        loadChildren: () => import('./servicios/servicios.module').then( mod => mod.ServiciosModule )
      },
      {
        path:'cursos',
        canActivate:[HasRoleGuard],
        data:{
          rolesPermitidos:['admin_role','user_role']
        },
        loadChildren: () => import('./curso/curso.module').then( mod => mod.CursoModule )
      },
      {
        path:'grupos',
        canActivate:[HasRoleGuard],
        data:{
          rolesPermitidos:['admin_role','user_role']
        },
        loadChildren: () => import('./grupo/grupo.module').then( mod => mod.GrupoModule )
      },
      {
        path:'matricula',
        canActivate:[HasRoleGuard],
        data:{
          rolesPermitidos:['admin_role','user_role']
        },
        loadChildren: () => import('./matricula/matricula.module').then( mod => mod.MatriculaModule )
      },
      {
        path:'chat-bot',
        canActivate:[HasRoleGuard],
        data:{
          rolesPermitidos:['admin_role','user_role']
        },
        loadChildren: () => import('./chat-bot/chat-bot.module').then( mod => mod.ChatBotModule )
      },
      {
        canActivate:[HasRoleGuard],
        data:{
          rolesPermitidos:['admin_role']
        },
        path:'config',
        loadChildren: () => import('./config/config.module').then( mod => mod.ConfigModule )
      },
      {

        path:'usuarios',
        canActivate:[HasRoleGuard],
        data:{
          rolesPermitidos:['admin_role']
        },
        loadChildren: () => import('./usuario/usuario.module').then( mod => mod.UsuarioModule )
      },
      {
        path:'perfil',
        canActivate:[HasRoleGuard],
        data:{
          rolesPermitidos:['admin_role','user_role','viewer_role']
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
