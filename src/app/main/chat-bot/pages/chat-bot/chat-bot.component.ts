import { Component, OnInit } from '@angular/core';
import { SocketService } from 'src/app/services/socket.service';
import { ChabotService } from '../../services/chatbot.service';

@Component({
  selector: 'app-chat-bot',
  templateUrl: './chat-bot.component.html',
  styleUrls: ['./chat-bot.component.scss']
})
export class ChatBotComponent implements OnInit {

  constructor(public readonly _bot:ChabotService, private readonly _socket:SocketService) { }

  ngOnInit(): void {
  }

  logoutWhatsapp(){
  }

}
