import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Curso } from 'src/app/main/curso/class/Curso';
import { Docente } from 'src/app/main/docente/class/Docente';
import { TipoGrupo } from 'src/app/main/grupo/class/Grupo';
import { ModalHorarioComponent } from 'src/app/main/grupo/components/modal-horario/modal-horario.component';
import { ModalTipoGrupoComponent } from 'src/app/main/grupo/components/modal-tipo-grupo/modal-tipo-grupo.component';
import { CursoService } from 'src/app/main/curso/services/curso.service';
import { DocenteService } from 'src/app/main/docente/services/docente.service';
import { GrupoService } from 'src/app/main/grupo/services/grupo.service';
import { SocketService } from 'src/app/services/socket.service';
import { Subscription } from 'rxjs';
import { Horario } from '../../class/Horario';
import * as moment from 'moment';
moment.locale("es");


export interface Modalidad {
  name:string,
  code:string;
}

@Component({
  selector: 'app-add-grupo',
  templateUrl: './add-grupo.component.html',
  styleUrls: ['./add-grupo.component.scss']
})
export class AddGrupoComponent implements OnInit {

  @ViewChild(ModalHorarioComponent) modalHorario:ModalHorarioComponent;
  @ViewChild(ModalTipoGrupoComponent) modalTGHorario:ModalTipoGrupoComponent;

  getListDocentes$:Subscription;
  getListCursos$:Subscription;
  getListTiposGrupos$:Subscription;
  getListHorarios$:Subscription;

  modalidad:Modalidad [] = [];
  FormGrupo:FormGroup;
  loaddSaveGrupo:boolean = false;

  ListDocentes:Docente[] = [];
  ListCursos:Curso[] = [];
  ListTipoNombres:TipoGrupo[] = [];
  ListHorarios:Horario[] = [];

  selecDocente:Docente | undefined;
  selecCurso:Curso | undefined;
  selecTipoNombres:TipoGrupo;
  selecHorario:Horario;
  opModalHorario:boolean = false;

  constructor(private _msg:MessageService,
              private _socket:SocketService,
              private fb: FormBuilder,
              private route:Router,
              private _grupo:GrupoService,
              private _docente:DocenteService,
              private _curso:CursoService) {

              this.createFormGrupo();
  }

  ngOnInit(): void {

    this.modalidad = [
      { name:'Presencial', code:'presencial'},
      { name:'Virtual', code:'virtual'},
      { name:'Semipresencial', code:'Semipresencial'}
    ]

    this.getListDocentes();
    this.getListCursos();
    this.getListTiposGrupos();
    this.getListHorarios();

    this.OnListTNombreGrupos();
    this.OnListHorarios();

  }

  ngOnDestroy(): void {
    this.getListDocentes$.unsubscribe();
    this.getListCursos$.unsubscribe();
    this.getListTiposGrupos$.unsubscribe();
    this.getListHorarios$.unsubscribe();
  }

  getListDocentes(){
    this.getListDocentes$ = this._docente.getAllListDocentes().subscribe({
      next: (value) => {
        if(value.ok){
          this.ListDocentes = value.data as Array<Docente>;
        }
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  getListCursos(){
    this.getListCursos$ = this._curso.getAllListCursos().subscribe({
      next: (value) => {
        if(value.ok){
          this.ListCursos = value.data as Array<Curso>;
        }
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  getListTiposGrupos(){
    this.getListTiposGrupos$ = this._grupo.getAllTipoGrupos().subscribe({
      next: (value) => {
        if(value.ok){
          this.ListTipoNombres = value.data as Array<TipoGrupo>;
        }
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  getListHorarios(){
    this.getListHorarios$ = this._grupo.getAllHorarios().subscribe({
      next: (value) => {
        if(value.ok){
          this.ListHorarios = value.data;
        }
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  createFormGrupo(){

    this.FormGrupo = this.fb.group({
      DescGrupo:[null, Validators.required],
      Modalidad:[null, [Validators.required]],
      FechaInicioGrupo:[null, [Validators.required]],
      FechaFinalGrupo:[null, [Validators.required]],
      MaximoEstudiantes:[null, [Validators.required, Validators.pattern(/^([0-9])*$/)]],
      docente:[null, Validators.required],
      curso:[null, Validators.required],
      tipoGrupo:[null, Validators.required],
      horario:[null, Validators.required]
    })

  }

  /** Getter from fron Grupo */
  get docente(){
    return this.FormGrupo.controls['docente'];
  }
  get curso(){
    return this.FormGrupo.controls['curso'];
  }
  get horario(){
    return this.FormGrupo.controls['horario'];
  }
  get Modalidad(){
    return this.FormGrupo.controls['Modalidad'];
  }
  get tipoGrupo(){
    return this.FormGrupo.controls['tipoGrupo'];
  }
  get DescGrupo(){
    return this.FormGrupo.controls['DescGrupo'];
  }
  get FechaInicioGrupo(){
    return this.FormGrupo.controls['FechaInicioGrupo'];
  }
  get FechaFinalGrupo(){
    return this.FormGrupo.controls['FechaFinalGrupo'];
  }
  get MaximoEstudiantes(){
    return this.FormGrupo.controls['MaximoEstudiantes'];
  }

  saveGrupo(){

    if(this.FormGrupo.invalid){

      Object.keys( this.FormGrupo.controls ).forEach( input => {
        this.FormGrupo.controls[input].markAsDirty();
      });

      return;
    }

    this.loaddSaveGrupo = true;

    this._grupo.createGrupo(this.FormGrupo.value).subscribe({
      next: (resp) => {
      setTimeout(() => {
        this.loaddSaveGrupo = false;
        if(resp.ok){
          this.resetGrupo();
          this.toast('success',resp.msg);
          this._socket.EmitEvent('updated_list_grupo');
        }else{
          this.toast('warn',resp.msg,'Registre un nuevo grupo con un nombre diferente');
        }
      },200);
      },
      error: (err) => {
          this.loaddSaveGrupo = false;
          err.error.message.forEach( (msg:string) => {
            this.toast('warn', msg,'Error al registrar un nuevo grupo');
          });
        },
    })

  }

  resetGrupo(){
    this.FormGrupo.reset();
    this.selecCurso = undefined;
    this.selecDocente = undefined;
  }

  selectedDocente(docente:Docente){
    this.selecDocente = docente;
  }

  selectedCurso(curso:Curso){
    this.selecCurso = curso;
  }

  selectedTiposNombres(tipo:TipoGrupo){
    this.selecTipoNombres = tipo;
  }

  selectedHorario(horario:Horario){
    this.selecHorario = horario;
  }

  toast(type:string, msg:string, detail:string=''){
    this._msg.add({severity:type, summary:msg, detail});
  }

  openModalHorario(){
    this.modalHorario.openModal();
  }

  openModalTGrupo(){
    this.modalTGHorario.openModal();
  }

  selecFechaInicio(date:Date){
    if(this.selecCurso && this.FechaInicioGrupo.valid && date){
      const fechaselect = moment(date);
      const fechaFin = fechaselect.add(this.selecCurso.NumModulos, 'months');
      this.FechaFinalGrupo.setValue(fechaFin.toDate());
      this.toast('info',`La fecha final del grupo es calculada en base a la cantidad de módulos del curso`);
    }
  }

  returnLista(){
    this.route.navigate(['/system/grupos/lista-grupos'])
  }

  /**
   * listen socket
   */
  OnListTNombreGrupos(){
    this._socket.OnEvent('list_tNombre_grupos').subscribe({
      next: (value) => {
        if(value.ok){
          this.ListTipoNombres = value.data as Array<TipoGrupo>;
        }
      },
      error: (e) => console.log(e)
    })
  }

  OnListHorarios(){
    this._socket.OnEvent('list_horarios').subscribe({
      next: (value) => {
        if(value.ok){
          this.ListHorarios = value.data as Array<Horario>;
        }
      },
      error: (e) => console.log(e)
    })
  }

}
