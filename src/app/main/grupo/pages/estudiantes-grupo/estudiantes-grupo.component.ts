import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlumnoEnGrupo, ResAddEnGrupo } from 'src/app/main/matricula/class/AlumnoEnGrupo';
import { Grupo } from '../../class/Grupo';
import { GrupoService } from '../../services/grupo.service';
import { map, pipe, tap } from 'rxjs';
import { Curso } from 'src/app/main/curso/class/Curso';
import { Docente } from 'src/app/main/docente/class/Docente';

@Component({
  selector: 'app-estudiantes-grupo',
  templateUrl: './estudiantes-grupo.component.html',
  styleUrls: ['./estudiantes-grupo.component.scss']
})
export class EstudiantesGrupoComponent implements OnInit {

  listaEstudiantes:AlumnoEnGrupo[] = [];
  resAlumnoEnGrupo:ResAddEnGrupo;
  loadingLista:boolean = false;
  startPage:number = 0;
  docente:Docente;
  grupo:Grupo;
  curso:Curso;
  expanded:boolean = false;

  constructor(private readonly _grupo:GrupoService,
              private readonly activeRoute:ActivatedRoute) {
                this.getIdGrupo(this.activeRoute);
   }

  ngOnInit(): void {
  }

  getIdGrupo(activeRoute:ActivatedRoute){
    const { id } = activeRoute.snapshot.params;
    this.loadingLista = true;
    this._grupo.getEstudiantesEnGrupoEspecifico(id).pipe(
      tap((res:any) => {
        if(res.data.length >= 1){
          this.grupo = res.data[0].grupo;
          this.curso = res.data[0].matricula.curso;
          this.docente = res.data[0].grupo.docente;
          console.log(res.data[0])
        }
        return res;
      })
    )
    .subscribe({
      next: (value) => {
        this.loadingLista = false;
        if(value.ok){
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
