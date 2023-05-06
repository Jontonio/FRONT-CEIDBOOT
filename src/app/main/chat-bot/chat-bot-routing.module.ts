import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatBotMainComponent } from './pages/chat-bot-main/chat-bot-main.component';
import { EnviarMensajeComponent } from './pages/enviar-mensaje/enviar-mensaje.component';
import { EstadoChatbotComponent } from './pages/estado-chatbot/estado-chatbot.component';

const routes: Routes = [
  {
    path:'', component:ChatBotMainComponent,
    children:[
      { path:'estado-bot', component: EstadoChatbotComponent },
      { path:'enviar-mensaje/:celular', component: EnviarMensajeComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChatBotRoutingModule { }
