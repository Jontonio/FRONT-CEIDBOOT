import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatBotMainComponent } from './pages/chat-bot-main/chat-bot-main.component';
import { ListIntentsComponent } from './pages/list-intents/list-intents.component';
import { IntentComponent } from './pages/intent/intent.component';

const routes: Routes = [
  {
    path:'', component:ChatBotMainComponent,
    children:[
      { path:'list-intents', component: ListIntentsComponent },
      { path:'intent/:uuid', component: IntentComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChatBotRoutingModule { }
