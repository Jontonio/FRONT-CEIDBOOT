import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Grupo } from '../../class/Grupo';
import { GrupoService } from '../../services/grupo.service';
import { Subscription, tap } from 'rxjs';
import { Curso } from 'src/app/main/curso/class/Curso';
import { Docente } from 'src/app/main/docente/class/Docente';
import { ShowFileComponent } from 'src/app/shared/show-file/show-file.component';
import { UnAuthorizedService } from 'src/app/services/unauthorized.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { EstudianteEnGrupo, ResEstadoEstudEnGrupo } from '../../class/EstudianteGrupo';
import { ModalMensualidadComponent } from '../../components/modal-mensualidad/modal-mensualidad.component';
import { Pago } from '../../class/Pago'
import { GlobalService } from 'src/app/services/global.service';
import { CategoriaPago } from '../../class/CategoriaPago';
import { ChabotService } from 'src/app/main/chat-bot/services/chatbot.service';
import { Message } from 'src/app/main/chat-bot/class/Message';
import { Estudiante } from 'src/app/main/matricula/class/Estudiante';
import { SocketService } from 'src/app/services/socket.service';
import { PayloadSocket } from 'src/app/class/PayloadSocket';
import * as moment from 'moment';
import {EstadoGrupoEstudiante, InfoDateGrupo } from '../../class/EstadoGrupoEstudiante';
import { GrupoModulo } from '../../class/GrupoModulo';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-estudiantes-grupo',
  templateUrl: './estudiantes-grupo.component.html',
  styleUrls: ['./estudiantes-grupo.component.scss']
})
export class EstudiantesGrupoComponent implements OnInit {

  @ViewChild('iframe') iframe: ElementRef;
  @ViewChild(ShowFileComponent) showFileComponent:ShowFileComponent;
  @ViewChild(ModalMensualidadComponent) modalMensualidad:ModalMensualidadComponent;

  listaEstudiantes$:Subscription;
  listaEstudiantes:EstudianteEnGrupo[] = [];
  resAlumnoEnGrupo:ResEstadoEstudEnGrupo;
  listCategoriaPago:CategoriaPago[];
  selectCategoria:string = 'Sin filtro';
  loadingLista:boolean = false;
  startPage:number = 0;
  docente:Docente;
  grupo:Grupo;
  curso:Curso;
  expanded:boolean = false;
  displayFile:boolean = false;
  sidebarMessage:boolean = false;
  fileURL:string;
  terminoBusqueda:string = '';
  numeroCelular:string;
  destino:string = 'e1';
  existsApodera:boolean = false;
  loadingSend:boolean = false;
  selectEstudiante:Estudiante;
  infoDateGrupo:InfoDateGrupo;
  nameEventSocket:string;
  idGrupo:string;
  limit:number  = 5;
  offset:number = 0;
  visibleModalFecha:boolean;
  formFecha:FormGroup;

  constructor(private readonly _grupo:GrupoService,
              private readonly fb:FormBuilder,
              private readonly activeRoute:ActivatedRoute,
              private readonly _socket:SocketService,
              private readonly _unAuth:UnAuthorizedService,
              private readonly _chatboot:ChabotService,
              private readonly _global: GlobalService,
              private _msg:MessageService) {
                this.getIdGrupo(this.activeRoute);
                this.onListaEstudiantesCurso();
                this.createFormFecha();
   }

  ngOnInit(): void {
    this.nameEventSocket = 'updated_list_estudiante_grupo';
    this.visibleModalFecha = false;
  }

  createFormFecha(){
    this.formFecha = this.fb.group({
      Id:[null, Validators.required],
      CurrentModulo:[null, Validators.required],
      FechaPago:[null, Validators.required],
      modulo:[null, Validators.required],
      grupo:[null, Validators.required],
    })
  }

  ngOnDestroy(): void {
    if(this.listaEstudiantes$) this.listaEstudiantes$.unsubscribe();
  }

  getIdGrupo(activeRoute:ActivatedRoute){
    const { idGrupo } = activeRoute.snapshot.params;
    this.loadingLista = true;
    this.idGrupo = idGrupo;
    this.getListaEstudiantesEnGrupo( this.idGrupo );
  }

  getCategoriaPagos(){
    this._global.getCategoriaPago().pipe(
      tap( resp => {
        if(!resp.ok) return resp;
        let newArr:CategoriaPago[] = [];
        newArr.push(...(resp.data) as CategoriaPago[]);
        newArr.push({ TipoCategoriaPago:'Sin filtro', CodeCategoriaPago:'all' } as CategoriaPago)
        resp.data = newArr;
        return resp;
      })
    )
    .subscribe({
      next: (value) => {
        if(value.ok){
          this.listCategoriaPago = value.data as Array<CategoriaPago>;
          return;
        }
      },
      error: (e) => {
        console.log(e)
      }
    })
  }

  paginate(event:any) {
    this.startPage = event.first;
    this.limit = event.rows;
    this.offset = event.first;
    this.getListaEstudiantesEnGrupo( this.idGrupo, this.limit, this.offset);
  }

  getListaEstudiantesEnGrupo(Id:string, limit:number = 5, offset:number = 0){
    this.listaEstudiantes$ = this._grupo.getEstudiantesEnGrupoEspecifico( Id, limit, offset)
    .subscribe({
      next: (value) => {
        this.loadingLista = false;
        console.log(value.data)
        if(value.ok){
          this.resAlumnoEnGrupo = value;
          this.grupo = value.data.grupo;
          this.curso = value.data.grupo.curso;
          this.docente = value.data.grupo.docente;
          this.listaEstudiantes = value.data.estudiantesEnGrupo;
          this.infoDateGrupo = value.data.infoDateGrupo;
          this.getCategoriaPagos();
        }
      },
      error: (e) => {
        this.loadingLista = false;
        this.messageError(e);
        this._unAuth.unAuthResponse(e);
      }
    })
  }

  showFile(fileURL:string){
    this.showFileComponent.showModal();
    this.showFileComponent.showSpinner();
    this.fileURL = fileURL;
  }

  closeModal(){
    this.displayFile = false;
  }

  selectFilter(categoriaPago:CategoriaPago){
    this.selectCategoria = categoriaPago.TipoCategoriaPago;
  }

  openModalValidarPago(pago:Pago){
    this.modalMensualidad.openModal(pago, new PayloadSocket(this.limit, this.offset, this.idGrupo));
  }

  openModalSidebarMessage({ estudiante }:EstudianteEnGrupo){
    this.sidebarMessage = true;
    this.selectEstudiante = estudiante;
    this.existsApodera = estudiante.apoderado?true:false;
  }

  sendMessage(event:string){
    this.numeroCelular = this.destinoSend( this.selectEstudiante );
    const message = new Message(this.numeroCelular, event );
    this.loadingSend = true;
    this._chatboot.sendMessage( message ).subscribe({
      next:(value) => {
        console.log(value)
        if(value.ok){
          this.toast('success', value.msg);
          this.loadingSend = false;
        }
      },
      error:(e) => {
        this.loadingSend = false;
        console.log(e)
      }
    })
  }

  destinoSend(estudiante: Estudiante){
    if(estudiante.apoderado && this.destino=='a1'){
      this.existsApodera = true;
      const {CodePhone, CelApoderado} = estudiante.apoderado;
      return `${CodePhone}${CelApoderado}`.replace('+','').concat('@c.us').trim();
    }
    const { CodePhone, Celular} = estudiante;
    return `${CodePhone}${Celular}`.replace('+','').concat('@c.us').trim();
  }

  opendModalEdit(data:GrupoModulo, Id:number){
    data.FechaPago = (moment(data.FechaPago)).toDate()
    data.grupo = { Id } as Grupo;
    this.formFecha.patchValue(data);
    this.visibleModalFecha = true;
  }

  estadoModalFecha(estado:boolean){
    this.visibleModalFecha = estado;
  }

  onListaEstudiantesCurso(){
    this._socket.OnEvent('list_estudian_en_grupo').subscribe({
      next:(value) => {
        this.grupo = value.data.grupo;
        this.listaEstudiantes = value.data.estudiantesEnGrupo;
      },
      error:(e) => {
        console.log(e)
      }
    })
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
