import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-lista-vacia',
  templateUrl: './lista-vacia.component.html',
  styleUrls: ['./lista-vacia.component.scss']
})
export class ListaVaciaComponent implements OnInit {

  @Input() msg:string = '';

  constructor() { }

  ngOnInit(): void {
  }

}
