import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChatBotRoutingModule } from './chat-bot-routing.module';
import { MaterialModule } from 'src/app/material/material.module';
import { PrimengModule } from 'src/app/primeng/primeng.module';
import { QRCodeModule } from 'angularx-qrcode';
import { HttpClientModule } from '@angular/common/http';
import { ChatBotMainComponent } from './pages/chat-bot-main/chat-bot-main.component';
import { EstadoChatbotComponent } from './pages/estado-chatbot/estado-chatbot.component';
import { EditorModule } from 'primeng/editor';
import { EditorComponent } from '../shared/editor/editor.component';
import { ListIntentsComponent } from './pages/list-intents/list-intents.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { IntentComponent } from './pages/intent/intent.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ChatBotMainComponent,
    EstadoChatbotComponent,
    EditorComponent,
    ListIntentsComponent,
    IntentComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    HttpClientModule,
    PrimengModule,
    ReactiveFormsModule,
    EditorModule,
    ChatBotRoutingModule,
    QRCodeModule,
    SharedModule
  ],
  exports:[
    EditorComponent
  ]
})
export class ChatBotModule { }
