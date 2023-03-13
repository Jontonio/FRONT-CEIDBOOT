import { Component } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';

@Component({
  selector: 'app-grupo',
  templateUrl: './grupo.component.html',
  styleUrls: ['./grupo.component.scss']
})

export class GrupoComponent {


  modalHorario:boolean = false;
  items: MenuItem[];
  activeItem:MenuItem;

  constructor() {}

}
