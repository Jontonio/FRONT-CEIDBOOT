import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Curso } from 'src/app/main/class/Curso';
import { Docente } from 'src/app/main/class/Docente';
import { TipoGrupo } from 'src/app/main/class/Grupo';
import { Horario } from 'src/app/main/class/Horario';
import { CursoService } from 'src/app/main/services/curso.service';
import { DocenteService } from 'src/app/main/services/docente.service';
import { GrupoService } from 'src/app/main/services/grupo.service';

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

  modalidad:Modalidad [] = [];
  FormGrupo:FormGroup;
  FormTipoGrupo:FormGroup;
  loaddSaveGrupo:boolean = false;

  ListDocentes:Docente[] = [];
  ListCursos:Curso[] = [];
  ListTipoNombres:TipoGrupo[] = [];
  ListHorarios:Horario[] = [];

  selecDocente:Docente;
  selecCurso:Curso;
  selecTipoNombres:TipoGrupo;
  selecHorario:Horario;

  constructor(private _msg:MessageService,
              private fb: FormBuilder,
              private _grupo:GrupoService,
              private _docente:DocenteService,
              private _curso:CursoService) {

                this.createFormGrupo();
                this.createFormTipoGrupo();
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

  }

  getListDocentes(){
    this._docente.getAllListDocentes().subscribe({
      next: (value) => {
        if(value.ok){
          this.ListDocentes = value.data;
        }
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  getListCursos(){
    this._curso.getAllListCursos().subscribe({
      next: (value) => {
        if(value.ok){
          this.ListCursos = value.data;
        }
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  getListTiposGrupos(){
    this._grupo.getAllTipoGrupos().subscribe({
      next: (value) => {
        if(value.ok){
          this.ListTipoNombres = value.data;
        }
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  getListHorarios(){
    this._grupo.getAllHorarios().subscribe({
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

  //TODO: Tipo Grupo
  createFormTipoGrupo(){

    this.FormTipoGrupo = this.fb.group({
      NombreGrupo:[null, [Validators.required ]],
      DescGrupo:[null],
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

  /** Getters Form Tipo Grupo */
  get NombreGrupo(){
    return this.FormTipoGrupo.controls['NombreGrupo'];
  }
  get DescTipGrupo(){
    return this.FormTipoGrupo.controls['DescGrupo'];
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

  saveTipoGrupo(){

    if(this.FormTipoGrupo.invalid){

      Object.keys( this.FormTipoGrupo.controls ).forEach( input => {
        this.FormTipoGrupo.controls[input].markAsDirty();
      });

      return;
    }


    this._grupo.createTipoGrupo(this.FormTipoGrupo.value).subscribe({
      next: (resp) => {
        if(resp.ok){
          this.resetTipoGrupo();
          this.toast('success',resp.msg);
        }else{
          this.toast('warn',resp.msg,'Registre un tipo de grupo diferente');
        }
      },
      error: (err) => {
        err.error.message.forEach( (msg:string) => {
          this.toast('warn', msg,'Error al registrar un nuevo tipo grupo');
        });
      },
    })

  }

  resetGrupo(){
    this.FormGrupo.reset();
  }

  resetTipoGrupo(){
    this.FormTipoGrupo.reset();
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

}
