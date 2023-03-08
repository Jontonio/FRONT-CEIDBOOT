import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Grupo, ResGetGrupo } from 'src/app/main/class/Grupo';
import { GrupoService } from 'src/app/main/services/grupo.service';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-list-grupo',
  templateUrl: './list-grupo.component.html',
  styleUrls: ['./list-grupo.component.scss']
})
export class ListGrupoComponent implements OnInit {

  listGrupos:Grupo[] = [];
  startPage:number = 0;
  changePage:boolean = false;
  loadding:boolean = false;
  resGetGrupo:ResGetGrupo;

  constructor(private route:Router,
              private _global:GlobalService,
              private _grupo:GrupoService) {

    this._global.parseURL(this.route);
    this.getAllGrupos();

  }

  ngOnInit(): void {
  }

  getAllGrupos(){

    this.loadding = true;

    this._grupo.getAllGrupos().subscribe({
      next:(value) => {
        setTimeout(() => {
          this.loadding = false;
          if(value.ok){
            console.log(value)
            this.listGrupos = value.data;
            this.resGetGrupo = value;
          }
        }, 200);
      },
      error:(err) => {
        this.loadding = false;
        console.log(err);
      },
    })
  }

  paginate(event:any) {
    this.changePage = true;

    this.startPage = event.first;

    this._grupo.getAllGrupos(event.rows, event.first).subscribe({
      next:(value) => {
        if(value.ok){
          this.listGrupos = value.data;
          this.resGetGrupo = value;
        }
      },
      error:(err) => {
        console.log(err);
      },
    })

  }

}
