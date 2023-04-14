import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Grupo } from '../../class/Grupo';
import { GrupoService } from '../../services/grupo.service';
import { map, pipe, tap } from 'rxjs';
import { Curso } from 'src/app/main/curso/class/Curso';
import { Docente } from 'src/app/main/docente/class/Docente';
import { Matricula } from 'src/app/main/matricula/class/Matricula';
import { NgxSpinnerService } from 'ngx-spinner';
import { ShowFileComponent } from 'src/app/shared/show-file/show-file.component';
import { UnAuthorizedService } from 'src/app/services/unauthorized.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { EstudianteEnGrupo, ResEstudianteEnGrupo } from '../../class/EstudianteGrupo';
import { animate, state, style, transition, trigger } from '@angular/animations';

export interface Product {
  id?:string;
  code?:string;
  name?:string;
  description?:string;
  price?:number;
  quantity?:number;
  inventoryStatus?:string;
  category?:string;
  image?:string;
  rating?:number;
}

@Component({
  selector: 'app-estudiantes-grupo',
  templateUrl: './estudiantes-grupo.component.html',
  styleUrls: ['./estudiantes-grupo.component.scss'],
  animations: [
    trigger('rowExpansionTrigger', [
        state('void', style({
            transform: 'translateX(-10%)',
            opacity: 0
        })),
        state('active', style({
            transform: 'translateX(0)',
            opacity: 1
        })),
        transition('* <=> *', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)'))
    ])
  ]
})
export class EstudiantesGrupoComponent implements OnInit {

  @ViewChild('iframe') iframe: ElementRef;
  @ViewChild(ShowFileComponent) showFileComponent:ShowFileComponent;

  products: Product[];


  listaEstudiantes:EstudianteEnGrupo[] = [];
  resAlumnoEnGrupo:ResEstudianteEnGrupo;
  loadingLista:boolean = false;
  startPage:number = 0;
  docente:Docente;
  grupo:Grupo;
  curso:Curso;
  expanded:boolean = false;
  displayFile:boolean = false;
  FileURL:string;

  constructor(private readonly _grupo:GrupoService,
              private readonly activeRoute:ActivatedRoute,
              private readonly _unAuth:UnAuthorizedService,
              private readonly spinner: NgxSpinnerService,
              private _msg:MessageService) {
                this.getIdGrupo(this.activeRoute);
   }

  ngOnInit(): void { }

  getIdGrupo(activeRoute:ActivatedRoute){
    const { id } = activeRoute.snapshot.params;
    this.loadingLista = true;
    this._grupo.getEstudiantesEnGrupoEspecifico(id).pipe(
      tap((res:any) => {
        if(res.data.length >= 1){
          this.grupo = res.data[0].grupo;
          this.curso = res.data[0].grupo.curso;
          this.docente = res.data[0].grupo.docente;
        }
        return res;
      })
    ).subscribe({
      next: (value) => {
        this.loadingLista = false;
        if(value.ok){
          this.resAlumnoEnGrupo = value;
          this.listaEstudiantes = this.resAlumnoEnGrupo.data as Array<EstudianteEnGrupo>;
        }
        console.log(value)
      },
      error: (e) => {
        this.loadingLista = false;
        this.messageError(e);
        this._unAuth.unAuthResponse(e);
      }
    })
  }

  paginate(event:any) {
    this.startPage = event.first;
    // this._grupo.getListaGrupos(event.rows, event.first);
    //TODO: falta listar
  }

  showFile(fileURL:string){
    this.showFileComponent.showModal();
    this.showFileComponent.showSpinner();
    this.FileURL = fileURL;
  }

  closeModal(){
    this.displayFile = false;
  }

  loadFile(){
    this.spinner.hide();
  }

  messageError(e:HttpErrorResponse){
    if(e.status==401) return;
    const msg = e.error.message;
    Array.isArray(msg)?msg.forEach((e) => this.toast('error',e,'Error de validación de datos')):
                                                  this.toast('error',msg,`${e.error.error}:${e.error.statusCode}`)
  }

  toast(type:string, msg:string, detail:string=''){
    this._msg.add({severity:type, summary:msg, detail});
  }


}
