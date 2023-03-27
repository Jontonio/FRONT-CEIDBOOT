import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlumnoEnGrupo, ResAddEnGrupo } from 'src/app/main/matricula/class/AlumnoEnGrupo';
import { GrupoService } from '../../services/grupo.service';

@Component({
  selector: 'app-pension-grupo',
  templateUrl: './pension-grupo.component.html',
  styleUrls: ['./pension-grupo.component.scss']
})
export class PensionGrupoComponent implements OnInit {

  listaEstudiantes:AlumnoEnGrupo[] = [];
  resAlumnoEnGrupo:ResAddEnGrupo;
  loadingLista:boolean = false;
  startPage:number = 0;

  constructor(private readonly _grupo:GrupoService,
              private readonly activeRoute:ActivatedRoute) {
                this.getIdGrupo(this.activeRoute);
   }

  ngOnInit(): void {
  }

  getIdGrupo(activeRoute:ActivatedRoute){
    const { id } = activeRoute.snapshot.params;
    this.loadingLista = true;
    this._grupo.getEstudiantesEnGrupoEspecifico(id).subscribe({
      next: (value) => {
        this.loadingLista = false;
        if(value.ok){
          console.log(value)
          this.resAlumnoEnGrupo = value;
          this.listaEstudiantes = this.resAlumnoEnGrupo.data as Array<AlumnoEnGrupo>;
        }
      },
      error: (e) => {
        this.loadingLista = false;
        console.log(e)
      }
    })
  }

  paginate(event:any) {
    this.startPage = event.first;
    // this._grupo.getListaGrupos(event.rows, event.first);
    //TODO: falta listar
  }

}
