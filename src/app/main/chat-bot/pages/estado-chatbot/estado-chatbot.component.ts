import { Component, OnInit } from '@angular/core';
import { ChabotService } from '../../services/chatbot.service';
import { Subscription } from 'rxjs';
import { ClientInfo } from '../../class/Bot';


@Component({
  selector: 'app-estado-chatbot',
  templateUrl: './estado-chatbot.component.html',
  styleUrls: ['./estado-chatbot.component.scss']
})
export class EstadoChatbotComponent implements OnInit {

  private generarQR$:Subscription;
  private getInfoCelphone$:Subscription;

  clientInfo:ClientInfo;

  constructor(public readonly _bot:ChabotService) {
    this.getInfoCelphone();
  }


  ngOnInit(): void {
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

}
