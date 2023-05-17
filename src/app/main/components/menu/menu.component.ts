import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';
import { GlobalService } from 'src/app/services/global.service';
import { SocketService } from 'src/app/services/socket.service';
import { Menu } from '../../class/Menu';
import { Logout } from 'src/app/auth/interfaces/Logout';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  items      :Menu[];
  display    :boolean = false;
  changeTheme:boolean = false;

  constructor(@Inject(DOCUMENT)
              private readonly document:Document,
              private readonly  _global:GlobalService,
              public  readonly _auth:AuthService,
              public  readonly _socket: SocketService,
              private readonly route:Router) {
  }

  ngOnInit(): void {

    this.initializeMenu();
    this.changeTheme = this._global.existsTheme();
    this.modeTheme(this.changeTheme);

  }

  theme(){
    this.changeTheme = this.changeTheme?false:true;
    this.modeTheme(this.changeTheme);
  }

  modeTheme(value:boolean, system:boolean = true){
    const themeLink = this.document.getElementById('app-theme') as HTMLLinkElement;
    themeLink.href = value?'mdc-dark-indigo.css':'mdc-light-indigo.css'
    if(system) this._global.saveTheme(value);
  }

  logout(){
    const data = new Logout(this._auth.userAuth?.Id, this._auth.userAuth?.Email);
    this._auth.logout(data).subscribe({
      next: (value) => {
        if(!value.ok) return;
        if(this._auth.readStorage('token')) this._auth.deleteStorage('token');
        this.modeTheme(false, false);
        this.route.navigate(['/auth/login']);
      },
      error: (e) => console.log(e)
    })
  }

  initializeMenu(){
    this.items = [
      {
        label: 'Panel principal',
        icon: 'fa-solid fa-house',
        routerLink:'/system/dashboard',
        role:['admin_role'],
      },
      {
        label: 'Grupos',
        icon: 'fa-solid fa-users-rectangle',
        routerLink:'/system/grupos/lista-grupos',
        role:['admin_role','user_role','viewer_role']
      },
      {
        label: 'prematriculas',
        icon: 'fa-solid fa-landmark',
        routerLink:'/system/matricula/matriculados',
        role:['admin_role','user_role','viewer_role']
      },
      {
        label: 'Cursos',
        icon: 'fa-solid fa-book',
        routerLink:'/system/cursos/lista-cursos',
        role:['admin_role','user_role','viewer_role']
      },
      {
        label: 'Docentes',
        icon: 'fa-solid fa-chalkboard-user',
        routerLink:'/system/docentes/lista-docentes',
        role:['admin_role','user_role','viewer_role']
      },
      {
        label: 'Trámites',
        icon: 'fa-solid fa-file-pen',
        routerLink:'/system/tramite/lista-tramites',
        role:['admin_role','user_role','viewer_role']
      },
      {
        label: 'ChatBot',
        icon: 'pi pi-qrcode',
        routerLink:'/system/chat-bot/list-intents',
        role:['admin_role','user_role','viewer_role']
      },
      {
        label: 'Usuarios',
        icon: 'fa-solid fa-users',
        routerLink:'/system/usuarios/lista-usuarios',
        role:['admin_role']
      },
      {
        label: 'Configuraciones',
        icon: 'fa-solid fa-gear',
        routerLink:'/system/config/general',
        role:['admin_role']
      },
      {
        label: 'Perfil',
        icon: 'fa-solid fa-user',
        routerLink:'/system/perfil',
        role:['admin_role','user_role','viewer_role']
      }
    ];
  }

}
