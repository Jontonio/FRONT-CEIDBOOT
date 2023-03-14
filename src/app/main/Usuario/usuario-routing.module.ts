import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddUsuarioComponent } from './pages/add-usuario/add-usuario.component';
import { ListUsuarioComponent } from './pages/list-usuario/list-usuario.component';
import { UsuarioComponent } from './pages/usuario/usuario.component';

const routes: Routes = [
  { path:'',
    component:UsuarioComponent,
    children:[
      { path:'add-usuario', component: AddUsuarioComponent },
      { path:'editar-usuario/:id', component: AddUsuarioComponent },
      { path:'lista-usuarios', component: ListUsuarioComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsuarioRoutingModule { }
