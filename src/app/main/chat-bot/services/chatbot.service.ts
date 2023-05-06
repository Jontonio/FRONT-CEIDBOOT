import { environment } from 'src/environments/environment';
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Router } from "@angular/router";
import { SocketService } from 'src/app/services/socket.service';
import { AuthBot } from '../class/AuthBot';
import { Message, ResMessage } from '../class/Message';


@Injectable({
  providedIn: 'root'
})
export class ChabotService {

  authBot:AuthBot;
  loading:boolean;
  private BASE_URL:string;

  constructor(private readonly http:HttpClient,
              private readonly route:Router,
              private readonly _socket:SocketService ){
                this.OnQr();
                this.BASE_URL = environment.BASE_URL }

  OnQr(){
    this.loading = true;
    this._socket.OnEvent('boot').subscribe({
      next: (value:AuthBot) => {
        this.authBot = value;
        this.loading = false;
        console.log(value)
      },
      error: (e) => {
        this.loading = false;
       console.log(e)
      }
    })
  }

  sendMessage(data:Message):Observable<ResMessage>{
    return this.http.post<ResMessage>(`${this.BASE_URL}/whatsapp/send-message`, data);
  }

}
