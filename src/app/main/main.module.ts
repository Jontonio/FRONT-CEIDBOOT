import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from './pages/main/main.component';
import { PrimengModule } from '../primeng/primeng.module';
import { NgIdleModule } from '@ng-idle/core';
import { MenuComponent } from './components/menu/menu.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DescripcionPipe } from '../pipes/descripcion.pipe';
import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../material/material.module';
import { ShowForRolesDirective } from './directive/show-for-roles.directive';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { WelcomeComponent } from './pages/welcome/welcome.component';

@NgModule({
  declarations: [
    MainComponent,
    MenuComponent,
    DescripcionPipe,
    ShowForRolesDirective,
    WelcomeComponent,
  ],
  imports: [
    CommonModule,
    MainRoutingModule,
    NgxChartsModule,
    PrimengModule,
    ReactiveFormsModule,
    FormsModule,
    MaterialModule,
    SharedModule,
    NgIdleModule.forRoot()
  ],
  providers: [ ConfirmationService, MessageService ],
  exports:[
    ShowForRolesDirective
  ]
})
export class MainModule { }
