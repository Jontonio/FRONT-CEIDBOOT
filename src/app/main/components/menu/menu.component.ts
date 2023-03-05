import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Logout } from 'src/app/auth/interfaces/Logout';
import { AuthService } from 'src/app/auth/services/auth.service';
import { GlobalService } from 'src/app/services/global.service';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  display    :boolean;
  items      :MenuItem[];
  changeTheme:boolean = false;

  constructor(@Inject(DOCUMENT)
              private document:Document,
              private _global:GlobalService,
              public _auth:AuthService,
              public _socket: SocketService,
              private route:Router) {
  }

  ngOnInit(): void {

    this.items = [
      {
        label: 'Panel principal',
        icon: 'fa-solid fa-house'
      },
      {
        label: 'Aulas',
        icon: 'fa-solid fa-people-roof',
        routerLink:'/system/aulas',
      },
      {
        label: 'Grupos',
        icon: 'fa-solid fa-users-rectangle',
        routerLink:'/system/grupos',
      },
      {
        label: 'Cursos',
        icon: 'fa-solid fa-book',
        routerLink:'/system/cursos/lista-cursos',
      },
      {
        label: 'Docentes',
        icon: 'fa-solid fa-chalkboard-user',
        routerLink:'/system/docentes/lista-docentes',
      },
      {
        label: 'ChatBot',
        icon: 'pi pi-qrcode',
      },
      {
        label: 'Usuarios',
        icon: 'fa-solid fa-users',
        routerLink:'/system/usuarios/lista-usuarios'
      },
      {
        label: 'Perfil',
        icon: 'fa-solid fa-user',
      }
    ];
    //theme
    this.changeTheme = this._global.existsTheme();
    this.modeTheme(this.changeTheme);
  }

  theme(){
    this.changeTheme = this.changeTheme?false:true;
    this.modeTheme(this.changeTheme);
  }

  modeTheme(value:boolean){
    let themeLink = this.document.getElementById('app-theme') as HTMLLinkElement;
    themeLink.href = value?'mdc-dark-indigo.css':'mdc-light-indigo.css'
    this._global.saveTheme(value);
  }

  logout(){

    const data = new Logout(this._auth.userAuth?.Id, this._auth.userAuth?.Email);

    this._auth.logout(data).subscribe({
      next: (value) => {

        if(value.ok){

          if(this._auth.readToken()){
            this._auth.deleteToken();
          }

          this.route.navigate(['/main/auth/login']);
        }

      },
      error: (err) => {

      },
    })


  }

}
