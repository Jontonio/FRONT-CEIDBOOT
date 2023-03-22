import { environment } from 'src/environments/environment';
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Router } from "@angular/router";
import { SocketService } from 'src/app/services/socket.service';
import { AuthBot } from '../class/AuthBot';


@Injectable({
  providedIn: 'root'
})
export class ChabotService {

  authBot:AuthBot;
  loading:boolean;

  constructor(private readonly http:HttpClient,
              private readonly route:Router,
              private readonly _socket:SocketService ){
                this.OnQr();
              }

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
}
