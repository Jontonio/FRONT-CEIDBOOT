import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  constructor(private socket:Socket) {
    // this.Onconexion();
    // this.OnMessage();
  }

  OnMessage(){
    this.socket.fromEvent('sendMessage').subscribe({
      next: (res) => console.log(res),
      error: (error) => console.log(error)

    })
    this.socket.fromEvent('welcome').subscribe({
      next: (res) => console.log(res),
      error: (error) => console.log(error)

    })
  }

  Onconexion(){
    this.socket.connect()
  }

  // save data of theme on localstorage
  saveTheme(status:boolean){
    localStorage.setItem('mode-theme', JSON.stringify(status) );
  }

  deleteTheme(){
    localStorage.removeItem('mode-theme');
  }

  existsTheme():boolean{
    if(localStorage.getItem('mode-theme')){
      return JSON.parse(localStorage.getItem('mode-theme')!);
    }
    return false;
  }

}
