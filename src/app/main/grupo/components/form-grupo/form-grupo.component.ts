import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Subscription, tap } from 'rxjs';

import { Curso } from 'src/app/main/curso/class/Curso';
import { CursoService } from 'src/app/main/curso/services/curso.service';
import { Docente } from 'src/app/main/docente/class/Docente';
import { DocenteService } from 'src/app/main/docente/services/docente.service';
import { Grupo, TipoGrupo } from '../../class/Grupo';
import { GrupoService } from '../../services/grupo.service';
import { Horario } from '../../class/Horario';
import { Modalidad } from 'src/app/main/matricula/interfaces/global';
import { optionOperation } from 'src/app/main/class/global';
import { SocketService } from 'src/app/services/socket.service';
import { MainService } from 'src/app/main/services/main.service';

import * as moment from 'moment';
import { EstadoGrupo } from '../../class/EstadoGrupo';
moment.locale("es");

@Component({
  selector: 'app-form-grupo',
  templateUrl: './form-grupo.component.html',
  styleUrls: ['./form-grupo.component.scss']
})
export class FormGrupoComponent implements OnInit {

  /** Output and Input variables */
  @Output() formData = new EventEmitter<optionOperation>();
  @Input() loading:boolean;

  /** Subscription variables */
  getListDocentes$:Subscription;
  getListCursos$:Subscription;
  getListTiposGrupos$:Subscription;
  getListHorarios$:Subscription;

  /** Varaibles de clase */
  FormGrupo:FormGroup;

  ListDocentes:Docente[] = [];
  ListCursos:Curso[] = [];
  ListTipoNombres:TipoGrupo[] = [];
  ListHorarios:Horario[] = [];
  selecDocente:Docente | undefined;
  selecCurso:Curso | undefined;
  selecTipoNombres:TipoGrupo;
  selecHorario:Horario;
  opModalHorario:boolean = false;
  initialEstadoGrupo:EstadoGrupo;

  isUpdate:boolean = false;
  Id:number;
  urlLista:string;
  isEmptyListEstadoGrupo:boolean;

  constructor(public readonly _main:MainService,
              private readonly _msg:MessageService,
              private readonly _socket:SocketService,
              private readonly fb: FormBuilder,
              private readonly route:Router,
              private readonly activeRoute:ActivatedRoute,
              private readonly _grupo:GrupoService,
              private readonly _docente:DocenteService,
              private readonly _curso:CursoService) {

              this.createFormGrupo();
              this.isEmptyListEstadoGrupo = false;
  }

  ngOnInit(): void {
    this.urlLista = '/system/grupos/lista-grupos';
    this.getListDocentes();
    this.getListCursos();
    this.getListTiposGrupos();
    this.getListHorarios();
    this.getListaEstadosGrupo();
    this.OnListTNombreGrupos();
    this.OnListHorarios();
    this.getIdUpdate(this.activeRoute);
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
        if(!value.ok) return;
        this.ListDocentes = value.data as Array<Docente>;
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
          this.ListHorarios = value.data as Array<Horario>;
        }
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  getListaEstadosGrupo(){
    this._grupo.getAllEstadoGrupo().pipe(
      tap( estadoGrupo => {
        /** aqui cateamos con valor del grupo de estado de matricula */
        const arrEstado = estadoGrupo.data as Array<EstadoGrupo>;
        this.initialEstadoGrupo = arrEstado[0];
        this.estadoGrupo.setValue(this.initialEstadoGrupo);
        return;
      })
    )
    .subscribe({
      next: (value) => {
        if(!value.ok){
          this.isEmptyListEstadoGrupo = true;
          this.toast('warn', value.msg,'','message-register-grupo');
          return;
        }
      },
      error: (e) => {
       this.messageError(e);
      }
    })
  }

  createFormGrupo(){

    this.FormGrupo = this.fb.group({
      estadoGrupo:[null, Validators.required],
      DescGrupo:[null, Validators.required],
      Modalidad:[null, [Validators.required]],
      FechaInicioGrupo:[null, [Validators.required]],
      FechaFinalGrupo:[null, [Validators.required]],
      MaximoEstudiantes:[null, [Validators.required, Validators.pattern(/^([0-9])*$/)]],
      docente:[null, Validators.required],
      curso:[null, Validators.required],
      tipoGrupo:[null, Validators.required],
      horario:[null, Validators.required],
      RequeridoPPago:[false, Validators.required ]
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
  get RequeridoPPago(){
    return this.FormGrupo.controls['RequeridoPPago'];
  }
  get estadoGrupo(){
    return this.FormGrupo.controls['estadoGrupo'];
  }

  toast(type:string, msg:string, detail:string='', key?:string){
    this._msg.add({severity:type, summary:msg, detail, key});
  }

  messageError(e:any){
    const msg = e.error.message;
    if(Array.isArray(msg)){
      msg.forEach( e => this.toast('error',e,'Error de validación de datos'))
    }else{
      this.toast('error',msg,`${e.error.error}:${e.error.statusCode}`)
    }
  }

  getIdUpdate(activeRouter:ActivatedRoute){
    const { id } = activeRouter.snapshot.params;
    if(!id) return;
    this.Id = id;
    this.isUpdate = true;
    this._grupo.getOneGrupo(id).subscribe({
      next: (resp) => {
        if(resp.ok){
          this.completeDataUpdate(resp.data as Grupo);
        }
      },
      error: (e) => {
        console.log(e);
        this.route.navigate([this.urlLista]);
        this.messageError(e);
      },
    })
  }

  ready(){
    /** validate data */
    if(this.FormGrupo.invalid){
      Object.keys( this.FormGrupo.controls ).forEach( input => this.FormGrupo.controls[input].markAsDirty() );
      return;
    }
    /** emit data */
    this.formData.emit({data:this.FormGrupo.value, option: this.isUpdate, Id:this.Id });
  }

  completeDataUpdate(grupo:Grupo){
    const fechaIniselect = moment(grupo.FechaInicioGrupo);
    const fechaFinselect = moment(grupo.FechaFinalGrupo);
    console.log(grupo)
    this.tipoGrupo.setValue(grupo.tipoGrupo);
    this.docente.setValue(grupo.docente);
    this.curso.setValue(grupo.curso);
    this.Modalidad.setValue(grupo.Modalidad);
    this.FechaInicioGrupo.setValue(fechaIniselect.toDate());
    this.FechaFinalGrupo.setValue(fechaFinselect.toDate());
    this.horario.setValue(grupo.horario);
    this.MaximoEstudiantes.setValue(grupo.MaximoEstudiantes);
    this.DescGrupo.setValue(grupo.DescGrupo);
    this.RequeridoPPago.setValue(grupo.RequeridoPPago);
    this.estadoGrupo.setValue(grupo.estadoGrupo);
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
    this.FechaInicioGrupo.setValue(null);
    this.FechaFinalGrupo.setValue(null);
  }

  selectedTiposNombres(tipo:TipoGrupo){
    this.selecTipoNombres = tipo;
  }

  selectedHorario(horario:Horario){
    this.selecHorario = horario;
  }

  selecFechaInicio(date:Date){
    if(this.selecCurso && this.FechaInicioGrupo.valid && date){
      const fechaselect = moment(date);
      const fechaFin = fechaselect.add(this.selecCurso.modulo.Modulo, 'months');
      this.FechaFinalGrupo.setValue(fechaFin.toDate());
      this.toast('info',`La fecha final del grupo es calculada en base a la cantidad de módulos del curso`);
    }
  }

  returnLista(){
    this.FormGrupo.reset();
    this.route.navigate([this.urlLista])
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
      error: (e) => this.messageError(e)
    })
  }

  OnListHorarios(){
    this._socket.OnEvent('list_horarios').subscribe({
      next: (value) => {
        if(value.ok){
          this.ListHorarios = value.data as Array<Horario>;
        }
      },
      error: (e) => this.messageError(e)
    })
  }

}
