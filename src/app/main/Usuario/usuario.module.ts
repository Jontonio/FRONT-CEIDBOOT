import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsuarioRoutingModule } from './usuario-routing.module';
import { UsuarioComponent } from './pages/usuario/usuario.component';
import { ListUsuarioComponent } from './pages/list-usuario/list-usuario.component';
import { AddUsuarioComponent } from './pages/add-usuario/add-usuario.component';
import { PrimengModule } from 'src/app/primeng/primeng.module';
import { FormUsuarioComponent } from './components/form-usuario/form-usuario.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { AvatarNamePipe } from './pipes/avatar-name.pipe';
import { FechaAccesoPipe } from './pipes/fecha-acceso.pipe';
import { MaterialModule } from 'src/app/material/material.module';
import { SkeletonFormComponent } from './components/skeleton-form/skeleton-form.component';
import { MainModule } from '../main.module';
import { BuscarUsuarioPipe } from './pipes/buscar-usuario.pipe';

@NgModule({
  declarations: [
    UsuarioComponent,
    ListUsuarioComponent,
    AddUsuarioComponent,
    FormUsuarioComponent,
    AvatarNamePipe,
    FechaAccesoPipe,
    SkeletonFormComponent,
    BuscarUsuarioPipe
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PrimengModule,
    SharedModule,
    UsuarioRoutingModule,
    MaterialModule,
    MainModule
  ]
})
export class usuarioModule { }
