import { Component, OnInit } from '@angular/core';
import { MenuItem, MessageService, } from 'primeng/api';

@Component({
  selector: 'app-add-matricula',
  templateUrl: './add-matricula.component.html',
  styleUrls: ['./add-matricula.component.scss']
})
export class AddMatriculaComponent implements OnInit {

  items: MenuItem[];

  constructor() {}

  ngOnInit() {

      this.items = [
        {
          label: 'Personal',
          routerLink:'/system/matricula/nueva-matricula/personal-info',
        },
        {
          label: 'Mayoria de edad',
          routerLink:'/system/matricula/nueva-matricula/mayoria-edad',
        },
        {
          label: 'Curso',
        },
        {
          label: 'Confirmation',
        }
      ];

  }

}
