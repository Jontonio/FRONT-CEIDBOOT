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
import { PerfilComponent } from './pages/Perfil/perfil/perfil.component';
import { ChatBotComponent } from './pages/Chatbot/chat-bot/chat-bot.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  providers: [MessageService, ConfirmationService],
  declarations: [
    MainComponent,
    MenuComponent,
    AulaComponent,
    DescripcionPipe,
    PerfilComponent,
    ChatBotComponent,
  ],
  imports: [
    CommonModule,
    MainRoutingModule,
    PrimengModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    NgIdleModule.forRoot()
  ]
})
export class MainModule { }
