import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChatBotRoutingModule } from './chat-bot-routing.module';
import { ChatBotComponent } from './pages/chat-bot/chat-bot.component';
import { MaterialModule } from 'src/app/material/material.module';
import { PrimengModule } from 'src/app/primeng/primeng.module';
import { QRCodeModule } from 'angularx-qrcode';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [
    ChatBotComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    HttpClientModule,
    PrimengModule,
    ChatBotRoutingModule,
    QRCodeModule
  ]
})
export class ChatBotModule { }
