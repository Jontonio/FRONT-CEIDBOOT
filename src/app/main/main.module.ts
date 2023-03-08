import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from './pages/main/main.component';
import { PrimengModule } from '../primeng/primeng.module';
import { NgIdleModule } from '@ng-idle/core';
import { MenuComponent } from './components/menu/menu.component';
import { AulaComponent } from './pages/aula/aula.component';
import { DocenteComponent } from './pages/Docente/docente/docente.component';
import { AddDocenteComponent } from './pages/Docente/add-docente/add-docente.component';
import { ListDocenteComponent } from './pages/Docente/list-docente/list-docente.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AddCursoComponent } from './pages/Curso/add-curso/add-curso.component';
import { CursoComponent } from './pages/Curso/curso/curso.component';
import { ListCursoComponent } from './pages/Curso/list-curso/list-curso.component';
import { UsuarioComponent } from './pages/Usuario/usuario/usuario.component';
import { AddUsuarioComponent } from './pages/Usuario/add-usuario/add-usuario.component';
import { ListUsuarioComponent } from './pages/Usuario/list-usuario/list-usuario.component';
import { ListaVaciaComponent } from './components/lista-vacia/lista-vacia.component';
import { AvatarNamePipe } from './pipes/avatar-name.pipe';
import { LoaddingComponent } from './components/loadding/loadding.component';
import { FechaAccesoPipe } from './pipes/fecha-acceso.pipe';
import { SkeletonTableComponent } from './skeleton/skeleton-table/skeleton-table.component';
import { FormCursoComponent } from './components/form-curso/form-curso.component';
import { FormDocenteComponent } from './components/form-docente/form-docente.component';
import { FormUsuarioComponent } from './components/form-usuario/form-usuario.component';
import { GrupoComponent } from './pages/Grupo/grupo/grupo.component';
import { InputCodeComponent } from './components/input-code/input-code.component';
import { DescripcionPipe } from './pipes/descripcion.pipe';
import { ListGrupoComponent } from './pages/Grupo/list-grupo/list-grupo.component';
import { AddGrupoComponent } from './pages/Grupo/add-grupo/add-grupo.component';
import { VerGrupoComponent } from './pages/Grupo/ver-grupo/ver-grupo.component';


@NgModule({
  providers: [MessageService,ConfirmationService],
  declarations: [
    MainComponent,
    MenuComponent,
    AulaComponent,
    DocenteComponent,
    UsuarioComponent,
    AddDocenteComponent,
    ListDocenteComponent,
    AddCursoComponent,
    CursoComponent,
    ListCursoComponent,
    AddUsuarioComponent,
    ListUsuarioComponent,
    ListaVaciaComponent,
    AvatarNamePipe,
    LoaddingComponent,
    FechaAccesoPipe,
    SkeletonTableComponent,
    FormCursoComponent,
    FormDocenteComponent,
    FormUsuarioComponent,
    GrupoComponent,
    InputCodeComponent,
    DescripcionPipe,
    ListGrupoComponent,
    AddGrupoComponent,
    VerGrupoComponent
  ],
  imports: [
    CommonModule,
    MainRoutingModule,
    PrimengModule,
    ReactiveFormsModule,
    FormsModule,
    NgIdleModule.forRoot()
  ]
})
export class MainModule { }
