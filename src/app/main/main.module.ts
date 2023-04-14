import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from './pages/main/main.component';
import { PrimengModule } from '../primeng/primeng.module';
import { NgIdleModule } from '@ng-idle/core';
import { MenuComponent } from './components/menu/menu.component';
import { AulaComponent } from './pages/aula/aula.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DescripcionPipe } from '../pipes/descripcion.pipe';
import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../material/material.module';

@NgModule({
  declarations: [
    MainComponent,
    MenuComponent,
    AulaComponent,
    DescripcionPipe
  ],
  imports: [
    CommonModule,
    MainRoutingModule,
    PrimengModule,
    ReactiveFormsModule,
    FormsModule,
    MaterialModule,
    SharedModule,
    NgIdleModule.forRoot()
  ],
  providers: [ ConfirmationService, MessageService ]
})
export class MainModule { }
