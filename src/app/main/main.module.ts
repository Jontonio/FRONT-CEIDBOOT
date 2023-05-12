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
import { InputSearchComponent } from './shared/input-search/input-search.component';
import { SidebarMessageComponent } from './shared/sidebar-message/sidebar-message.component';
import { ChatBotModule } from './chat-bot/chat-bot.module';

@NgModule({
  declarations: [
    MainComponent,
    MenuComponent,
    DescripcionPipe,
    ShowForRolesDirective,
    WelcomeComponent,
    InputSearchComponent,
    SidebarMessageComponent,
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
    NgIdleModule.forRoot(),
    ChatBotModule
  ],
  providers: [ ConfirmationService, MessageService ],
  exports:[
    ShowForRolesDirective,
    InputSearchComponent,
    SidebarMessageComponent
  ]
})
export class MainModule { }
