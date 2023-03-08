import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Curso, ResGetCurso } from 'src/app/main/class/Curso';
import { CursoService } from 'src/app/main/services/curso.service';
import { GlobalService } from 'src/app/services/global.service';


@Component({
  selector: 'app-list-curso',
  templateUrl: './list-curso.component.html',
  styleUrls: ['./list-curso.component.scss']
})
export class ListCursoComponent implements OnInit {

  resGetCursos:ResGetCurso;
  startPage   :number = 0;
  listCursos  :Curso[] = [];
  loadding    :boolean = false;
  changePage  :boolean = false;

  constructor(public _cursos:CursoService,
              private route:Router,
              private _global:GlobalService) {

    this.getAllCursos();
    this._global.parseURL(this.route);

  }

  ngOnInit(): void {

    this.OnCursos();

  }

  getAllCursos(){

    this.loadding = true;

    this._cursos.getAllCursos().subscribe({
      next: (value) => {

        setTimeout(() => {
          this.loadding = false;
          this.resGetCursos = value;
          this.listCursos = value.data
        }, 300);

      },
      error: (err) => {
        this.loadding = false;
        console.log(err);
      },
    })
  }

  paginate(event:any) {
    //event.first = Index of the first record
    //event.rows = Number of rows to display in new page
    //event.page = Index of the new page
    //event.pageCount = Total number of pages
    this.changePage = true;
    this.startPage = event.first;
    this._cursos.getAllCursos(event.rows, event.first).subscribe({

      next: (value) => {
        this.resGetCursos = value;
        this.listCursos = value.data;
      },
      error: (err) => {
        console.log(err);
      },

    });

  }

  OnCursos(){

    this._cursos.OnListaCursos().subscribe({
      next: (value) => {
        this.listCursos = value.data;
      },
      error: (err) => {
        console.log(err);
      },
    })

  }



}
