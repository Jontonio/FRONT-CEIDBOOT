import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  statusServer:boolean = false;

  constructor( private socket:Socket ){}

  OnEvent(event:string):Observable<any>{
    return this.socket.fromEvent(event);
  }

  EmitEvent(nameEvent:string, payload?:any){
    this.socket.emit(nameEvent, payload);
  }

  Onconexion(){
     // verificar si se conecto al servidor el cliente
     this.socket.on('connect', () => {
      this.statusServer = true;
    })

    // verificar si el cliente desconecto
    this.socket.on('disconnect', () => {
      this.statusServer = false;
      console.log("Connect from back");
    })
  }

}
