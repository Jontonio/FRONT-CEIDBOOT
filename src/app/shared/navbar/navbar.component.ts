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
          label:'Matriculas',
          icon:'fa-solid fa-graduation-cap',
          routerLink:'/main/matricula'
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
