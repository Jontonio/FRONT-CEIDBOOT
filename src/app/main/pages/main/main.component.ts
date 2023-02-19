import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

import { Keepalive } from '@ng-idle/keepalive';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { MenuItem } from 'primeng/api';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  themeSelecion = false;
  display:boolean = false;

  ruta: MenuItem[];

  //representa la cuenta regresiva del modal
  contador:number = 20;
  //representa el tiempo en segundos de intervalo permitido de inactividad en el sistema
  //240s representa 4 min de holgura
  tiempo:number = 240;
  countdown?: number;
  lastPing?: Date;

  constructor(private _auth:AuthService,
              private idle: Idle, keepalive: Keepalive, cd: ChangeDetectorRef) {
    // set idle parameters
    idle.setIdle(this.tiempo); // how long can they be inactive before considered idle, in seconds
    idle.setTimeout(this.contador); // how long can they be idle before considered timed out, in seconds
    idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    idle.onIdleStart.subscribe(() => {
      //TODO: se activa el contador setTimeout()
      this.displayModal = true;
    });

    idle.onIdleEnd.subscribe(() => {
      //TODO: se activa cuando el usurio reinicia la tarea en el ordenador
      this.countdown = undefined;
      cd.detectChanges();
    });

    idle.onTimeout.subscribe(() =>{
      //TODO: termina el observer
      this.logout();
    });

    idle.onTimeoutWarning.subscribe(seconds => this.countdown = seconds);

    keepalive.interval(15); // will ping at this interval while not idle, in seconds
    keepalive.onPing.subscribe(() => this.lastPing = new Date()); // do something when it pings

   }

  reset() {
    //TODO: por defecto inicia en NOT_IDLE
    this.idle.watch();
    this.countdown = undefined;
    this.lastPing = undefined;
  }

  ngOnInit(): void {
    this.reset();

    this.ruta = [
      {label:'', icon:'pi pi-home'},
      {label:'Sports'},
      {label:'Football'},
      {label:'Countries'},
    ];
  }

  logout(){
    this._auth.logout()
  }

  displayModal:boolean = false;
  showModalDialog() {
    this.displayModal = true;
  }

  keepSession(){
    this.displayModal = false;
    this.reset();
  }

  closeSesion(){
    this.displayModal = false;
    this.logout();
  }

  toggleMenu(value:boolean){
    this.display = value;
    console.log(this.display);
  }

}
