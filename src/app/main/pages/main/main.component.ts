import { ChangeDetectorRef,
         Component,
         OnInit,
         NgZone } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';

import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { MenuItem } from 'primeng/api';
import { SocketService } from 'src/app/services/socket.service';
import { Logout } from 'src/app/auth/interfaces/Logout';
import { GlobalService } from 'src/app/services/global.service';
import { Router } from '@angular/router';
import { MainService } from '../../services/main.service';


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
  //240s representa 10 min de holgura
  tiempo:number = 600;
  countdown?: number;
  lastPing?: Date;

  constructor(private route:Router,
              private _auth:AuthService,
              public _global:GlobalService,
              private idle: Idle,
              private ngZone: NgZone,
              private cd: ChangeDetectorRef,
              private _socket:SocketService) {
                this.InitIdle();
                this.welcomeMessage();
              }

  welcomeMessage(){
    this._socket.OnEvent('welcome-ceidbot').subscribe({
      next: (value) => {
        console.log(value);
      },
      error: (err) => console.log(err)
    })
  }

  reset() {
    //TODO: por defecto inicia en NOT_IDLE
    this.idle.watch();
    this.countdown = undefined;
    this.lastPing = undefined;
  }

  ngOnInit(): void {
    this.reset();
  }

  InitIdle(){
    // set idle parameters
    this.idle.setIdle(this.tiempo);
    this.idle.setTimeout(this.contador);
    this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    this.idle.onIdleStart.subscribe(() => {
      //TODO: se activa el contador setTimeout()
      console.log("cerrando sesión en ", this.countdown);
    });

    this.idle.onIdleEnd.subscribe(() => {
      //TODO: se activa cuando el usurio reinicia la tarea en el ordenador
      this.countdown = undefined;
      this.cd.detectChanges();
    });

    this.idle.onTimeout.subscribe(() =>{
      //TODO: termina el observer
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
        if(value.ok){
          if(this._auth.readToken()){
            this._auth.deleteToken();
          }
          this.route.navigate(['/main/auth/login']);
        }
      },
      error:(err) => {
        console.log("cerrar sesión",err);
      },
    })

  }

}
