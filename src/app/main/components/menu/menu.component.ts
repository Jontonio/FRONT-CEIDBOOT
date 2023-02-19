import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { AuthService } from 'src/app/services/auth.service';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  display:boolean;
  items: MenuItem[];
  changeTheme:boolean = false;

  constructor(@Inject(DOCUMENT)
              private document:Document,
              private _global:GlobalService,
              private _auth:AuthService) {
  }

  ngOnInit(): void {

    this.items = [
      {
        label: 'Panel principal',
        icon: 'pi pi-pw pi-home'
      },
      {
        label: 'Aulas',
        icon: 'pi pi-table',
        routerLink:'/system/aulas',
      },
      {
        label: 'Cursos',
        icon: 'pi pi-book',
        routerLink:'/system/cursos',
      },
      {
        label: 'Docentes',
        icon: 'pi pi-briefcase',
        routerLink:'/system/docentes',
      },
      {
        label: 'ChatBot',
        icon: 'pi pi-qrcode',
      },
      {
        label: 'Usuarios',
        icon: 'pi pi-fw pi-users',
        routerLink:'/system/usuarios'
      },
      {
        label: 'Perfil',
        icon: 'pi pi-shield',
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
    this._auth.logout()
  }

}
