import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Docente, ResGetDocente } from 'src/app/main/class/Docente';
import { DocenteService } from 'src/app/main/services/docente.service';
import { GlobalService } from 'src/app/services/global.service';

export enum Color{
  rojo, negro, azul, verde
}

@Component({
  selector: 'app-list-docente',
  templateUrl: './list-docente.component.html',
  styleUrls: ['./list-docente.component.scss']
})
export class ListDocenteComponent implements OnInit {

  resGetDocente:ResGetDocente;
  startPage   :number = 0;
  changePage  :boolean = false;
  listDocentes:Docente[] = [];
  loadding    :boolean = false;

  constructor(public _docente:DocenteService,
              private _global:GlobalService,
              private route:Router) {

    this.getLitsDocentes();
    this._global.parseURL(route);

  }

  getLitsDocentes(){

    this.loadding = true;

    this._docente.getAllDocentes().subscribe({
      next: (value) => {

        setTimeout(() => {
          this.loadding = false;
          this.resGetDocente = value;
          this.listDocentes = value.data;
        }, 300);

      },
      error: (err) => {
        this.loadding = false;
        console.log(err);
      },
    })

  }

  paginate(event:any) {
    this.changePage = true;

    this.startPage = event.first;
    this._docente.getAllDocentes(event.rows, event.first).subscribe({
      next: (value) => {
        this.resGetDocente = value;
        this.listDocentes = value.data;
      },
      error: (err) => {
        console.log(err);
      },
    });

  }

  ngOnInit(): void {

    this.OnDocentes();

  }

  OnDocentes(){

    this._docente.OnListDocente().subscribe({
      next: (value) => {
        this.listDocentes = value.data;
      },
      error: (err) => {
        console.log(err);
      },
    })

  }

}
