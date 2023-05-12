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
          icon:'fa-solid fa-house',
          routerLink:'/main/home',
      },
      {
          label:'Nosotros',
          icon:'fa-solid fa-building-columns',
          routerLink:'/main/nosotros'
      },
      {
        label:'Servicios',
        icon:'fa-solid fa-globe',
        items:[
          {
            label:'Matriculas',
            icon:'fa-solid fa-graduation-cap',
            routerLink:'/main/matricula'
          },
          {
            label:'Registro de pagos',
            icon:'fa-solid fa-bag-shopping',
            routerLink:'/main/pagos'
          },
          {
            label:'Otros trámites',
            icon:'fa-solid fa-file-pen',
            routerLink:'/main/otros-tramites',
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
