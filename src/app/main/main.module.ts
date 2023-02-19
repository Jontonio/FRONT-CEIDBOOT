import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from './pages/main/main.component';
import { PrimengModule } from '../primeng/primeng.module';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { MenuComponent } from './components/menu/menu.component';
import { AulaComponent } from './pages/aula/aula.component';
import { CursoComponent } from './pages/curso/curso.component';
import { DocenteComponent } from './pages/docente/docente.component';
import { UsuarioComponent } from './pages/usuario/usuario.component';


@NgModule({
  declarations: [
    MainComponent,
    MenuComponent,
    AulaComponent,
    CursoComponent,
    DocenteComponent,
    UsuarioComponent,
  ],
  imports: [
    CommonModule,
    MainRoutingModule,
    PrimengModule,
    NgIdleKeepaliveModule.forRoot()
  ]
})
export class MainModule { }
