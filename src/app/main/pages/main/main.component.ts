import { ChangeDetectorRef, Component, OnInit, NgZone, Inject} from '@angular/core';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { AuthService } from 'src/app/auth/services/auth.service';
import { MenuItem, MessageService } from 'primeng/api';
import { SocketService } from 'src/app/services/socket.service';
import { Logout } from 'src/app/auth/interfaces/Logout';
import { GlobalService } from 'src/app/services/global.service';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';

import * as moment from 'moment';
import { ChabotService } from '../../chat-bot/services/chatbot.service';
import { UnAuthorizedService } from 'src/app/services/unauthorized.service';
moment.locale("es");

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  /** variables de clase */
  themeSelecion = false;
  display:boolean = false;
  ruta: MenuItem[];
  displayModalAuth:boolean;

  /** representa la cuenta regresiva del modal */
  contador:number = 20;
  /** representa el tiempo en segundos de intervalo permitido de inactividad en el sistema
  * 1800s representa 30 min de holgura
  */
  tiempo:number = 1800;
  countdown?: number;
  lastPing?: Date;

  constructor(@Inject(DOCUMENT)
              private readonly document:Document,
              private readonly route:Router,
              public  readonly _auth:AuthService,
              public  readonly _unAuth:UnAuthorizedService,
              public  readonly _global:GlobalService,
              private _msg:MessageService,
              private readonly idle: Idle,
              private readonly ngZone: NgZone,
              private readonly cd: ChangeDetectorRef,
              private readonly _socket:SocketService){
                this.InitIdle();
                this._socket.Onconexion();
  }

  reset() {
    //? TODO: por defecto inicia en NOT_IDLE
    this.idle.watch();
    this.countdown = undefined;
    this.lastPing = undefined;
  }

  ngOnInit(): void {
    this.reset();
    this.listenStatusNotificacions();
  }

  modeTheme(value:boolean, system:boolean = true){
    const themeLink = this.document.getElementById('app-theme') as HTMLLinkElement;
    themeLink.href = value?'mdc-dark-indigo.css':'mdc-light-indigo.css'
    if(system) this._global.saveTheme(value);
  }

  InitIdle(){
    // set idle parameters
    this.idle.setIdle(this.tiempo);
    this.idle.setTimeout(this.contador);
    this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    this.idle.onIdleStart.subscribe(() => {
      //? TODO: se activa el contador setTimeout()
      console.log("cerrando sesión en ", this.countdown);
    });

    this.idle.onIdleEnd.subscribe(() => {
      //? TODO: se activa cuando el usurio reinicia la tarea en el ordenador
      this.countdown = undefined;
      this.cd.detectChanges();
    });

    this.idle.onTimeout.subscribe(() =>{
      //? TODO: termina el observer
      console.log("Cerrando sesión por seguridad");
      this.ngZone.run(() => {
        this.logout();
      })

    });
    this.idle.onTimeoutWarning.subscribe(seconds => this.countdown = seconds);
  }

  toggleMenu(value:boolean){
    this.display = value;
    console.log(this.display);
  }

  logout(){
    const data = new Logout(this._auth.userAuth?.Id, this._auth.userAuth?.Email);
    this._auth.logout(data).subscribe({
      next:(value) => {
        if(!value.ok) return;
        this.resetAuth();
      },
      error:(err) => console.log("cerrar sesión",err)
    })

  }

  resetAuth(){
    if(this._auth.readStorage('token')) this._auth.deleteStorage('token');
    this.modeTheme(false, false);
    this._unAuth.showModalAuth = false;
    this.route.navigate(['/main/auth/login']);
  }

  listenStatusNotificacions(){
    this._socket.OnEvent('message-send-notification').subscribe({
      next:(value) => {
        this.toast('success', value.msg, 'Notificación de envio de comunicados','message-send-comunicados');
      },
      error:(e) => {
        console.log(e)
      },
    })
  }

  toast(severity:string, summary:string, detail:string='', key=''){
    this._msg.add({severity, summary, detail, key});
  }
}
