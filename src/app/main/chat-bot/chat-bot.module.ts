import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChatBotRoutingModule } from './chat-bot-routing.module';
import { MaterialModule } from 'src/app/material/material.module';
import { PrimengModule } from 'src/app/primeng/primeng.module';
import { QRCodeModule } from 'angularx-qrcode';
import { HttpClientModule } from '@angular/common/http';
import { ChatBotMainComponent } from './pages/chat-bot-main/chat-bot-main.component';
import { EnviarMensajeComponent } from './pages/enviar-mensaje/enviar-mensaje.component';
import { EstadoChatbotComponent } from './pages/estado-chatbot/estado-chatbot.component';
import { EditorModule } from 'primeng/editor';
import { EditorComponent } from './components/editor/editor.component';


@NgModule({
  declarations: [
    ChatBotMainComponent,
    EnviarMensajeComponent,
    EstadoChatbotComponent,
    EditorComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    HttpClientModule,
    PrimengModule,
    EditorModule,
    ChatBotRoutingModule,
    QRCodeModule
  ],
  exports:[
    EditorComponent
  ]
})
export class ChatBotModule { }
