import { Component, OnInit } from '@angular/core';
import { ChabotService } from '../../services/chatbot.service';
import { Subscription } from 'rxjs';
import { ClientInfo } from '../../class/Bot';
import { SocketService } from 'src/app/services/socket.service';


@Component({
  selector: 'app-estado-chatbot',
  templateUrl: './estado-chatbot.component.html',
  styleUrls: ['./estado-chatbot.component.scss']
})
export class EstadoChatbotComponent implements OnInit {

  private generarQR$:Subscription;
  private getInfoCelphone$:Subscription;

  clientInfo:ClientInfo;

  constructor(public readonly _bot:ChabotService,
              private readonly _socket:SocketService) {
    this.getInfoCelphone();
  }


  ngOnInit(): void {
    this.stateChangeWhatsApp();
  }

  ngOnDestroy(): void {
    if(this.generarQR$) this.generarQR$.unsubscribe();
    if(this.getInfoCelphone$) this.getInfoCelphone$.unsubscribe();
  }

  generateQR(){
    this.generarQR$ = this._bot.generarQR().subscribe({
      next: (value) => {
        console.log(value)
      },
      error: (e) => {
        console.log(e)
      }
    })
  }

  getInfoCelphone(){
    this.getInfoCelphone$ = this._bot.getInfoCelphone().subscribe({
      next: (value) => {
        this.clientInfo = value.data;
      },
      error: (e) => {
        console.log(e)
      }
    })
  }

  stateChangeWhatsApp(){
    this._socket.OnEvent('change_state_whatsApp').subscribe({
      next:(res) => {
        console.log(res)
      },
      error:(e) => {
        console.log(e)
      }
    })
  }

  reloadQr(){

  }

}
