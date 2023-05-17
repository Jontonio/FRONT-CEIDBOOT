import { Component, OnInit } from '@angular/core';
import { ChabotService } from '../../services/chatbot.service';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-estado-chatbot',
  templateUrl: './estado-chatbot.component.html',
  styleUrls: ['./estado-chatbot.component.scss']
})
export class EstadoChatbotComponent implements OnInit {

  constructor(public readonly _bot:ChabotService, private readonly _socket:SocketService) { }


  ngOnInit(): void {
  }

  generateQR(){
    this._bot.generarQR().subscribe({
      next: (value) => {
        console.log(value)
      },
      error: (e) => {
        console.log(e)
      }
    })
  }

}
