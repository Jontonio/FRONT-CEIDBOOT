import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Grupo } from 'src/app/main/class/Grupo';
import { GrupoService } from 'src/app/main/services/grupo.service';

@Component({
  selector: 'app-ver-grupo',
  templateUrl: './ver-grupo.component.html',
  styleUrls: ['./ver-grupo.component.scss']
})
export class VerGrupoComponent implements OnInit {

  grupo:Grupo;

  constructor(private routerActive:ActivatedRoute, private _grupo:GrupoService) {

    this.getIdParams(this.routerActive);

  }

  ngOnInit(): void {

  }

  getIdParams(routerActive:ActivatedRoute){

    const { id } = routerActive.snapshot.params;

    this._grupo.getOneGrupo(id).subscribe({
      next: (value) => {
        if(value.ok){
          this.grupo = value.data
        }
      },
      error: (err) => {
        console.log(err)
      },
    })

  }

}
