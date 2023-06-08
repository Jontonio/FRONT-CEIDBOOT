import { environment } from 'src/environments/environment';
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Router } from "@angular/router";
import { SocketService } from 'src/app/services/socket.service';
import { EstadoWhatsApp } from '../class/AuthBot';
import { Message, ResMessage } from '../class/Message';
import { ResIntent } from '../class/Intent';
import { ResBot } from '../class/Bot';


@Injectable({
  providedIn: 'root'
})
export class ChabotService {

  estadoWhatsApp:EstadoWhatsApp;
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
      next: (value:EstadoWhatsApp) => {
        this.estadoWhatsApp = value;
        this.loading = false;
      },
      error: (e) => {
        this.loading = false;
       console.log(e)
      }
    })
  }

  getIntents():Observable<ResIntent>{
    return this.http.get<ResIntent>(`${this.BASE_URL}/dialogflow/get-all-intents`);
  }

  getOneIntent(uuid:string):Observable<ResIntent>{
    return this.http.get<ResIntent>(`${this.BASE_URL}/dialogflow/get-one-intent/${uuid}`);
  }

  updateOneTxtIntent(uuid:string, data:any):Observable<ResIntent>{
    return this.http.patch<ResIntent>(`${this.BASE_URL}/dialogflow/update-one-txt-intent/${uuid}`, data);
  }

  updateOnePayloadIntent(uuid:string, data:any):Observable<ResIntent>{
    return this.http.patch<ResIntent>(`${this.BASE_URL}/dialogflow/update-one-payload-intent/${uuid}`, data);
  }

  sendMessage(data:Message):Observable<ResMessage>{
    return this.http.post<ResMessage>(`${this.BASE_URL}/bot/send-message`, data);
  }

  generarQR(){
    return this.http.get(`${this.BASE_URL}/bot/generate-qr-whatsapp`);
  }

  getInfoCelphone(){
    return this.http.get<ResBot>(`${this.BASE_URL}/bot/info-whatsapp`);
  }

}
