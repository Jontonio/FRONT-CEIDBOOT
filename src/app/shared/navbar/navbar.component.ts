import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  items: MenuItem[];

  constructor(private ruta:Router) { }

  ngOnInit(): void {
    this.items = [
      {
          label:'Inicio',
          icon:'pi pi-building',
          routerLink:'/main/home',
      },
      {
          label:'Nosotros',
          icon:'pi pi-users',
          routerLink:'/main/nosotros'
      },
      {
          label:'Mas',
          icon:'pi pi-fw pi-user',
          items:[
              {
                  label:'New',
                  icon:'pi pi-fw pi-user-plus',

              },
              {
                  label:'Delete',
                  icon:'pi pi-fw pi-user-minus',

              }
          ]
      }
    ];
  }

  clikme(){
    this.ruta.navigateByUrl('/main/nosotros').then( res => {
      console.log(res);
    }).catch(error => {
      console.log(error)
    })
  }

}
