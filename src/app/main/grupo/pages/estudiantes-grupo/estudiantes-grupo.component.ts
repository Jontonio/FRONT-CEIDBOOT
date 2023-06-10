import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Grupo } from '../../class/Grupo';
import { GrupoService } from '../../services/grupo.service';
import { Subscription, tap } from 'rxjs';
import { Curso } from 'src/app/main/curso/class/Curso';
import { Docente } from 'src/app/main/docente/class/Docente';
import { ShowFileComponent } from 'src/app/shared/show-file/show-file.component';
import { UnAuthorizedService } from 'src/app/services/unauthorized.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ConfirmationService, MessageService } from 'primeng/api';
import { EstudianteEnGrupo, ResEstadoEstudEnGrupo } from '../../class/EstudianteGrupo';
import { ModalMensualidadComponent } from '../../components/modal-mensualidad/modal-mensualidad.component';
import { Pago } from '../../class/Pago'
import { GlobalService } from 'src/app/services/global.service';
import { CategoriaPago } from '../../class/CategoriaPago';
import { Estudiante } from 'src/app/main/matricula/class/Estudiante';
import { SocketService } from 'src/app/services/socket.service';
import { PayloadSocket } from 'src/app/class/PayloadSocket';
import * as moment from 'moment';
import { InfoDateGrupo } from '../../class/EstadoGrupoEstudiante';
import { GrupoModulo } from '../../class/GrupoModulo';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Mora } from '../../class/Mora';
import { Matricula } from 'src/app/main/matricula/class/Matricula';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ModalPagoExtemporaneoComponent } from '../../components/modal-pago-extemporaneo/modal-pago-extemporaneo.component';
import { MatriculaService } from 'src/app/main/matricula/services/matricula.service';

interface EstadoMatricula{
  value:string;
  code:string;
}

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
  openSidebarMessage:boolean = false;
  updateFechaInicio:boolean = true;
  fileURL:string;
  terminoBusqueda:string = '';
  infoDateGrupo:InfoDateGrupo;
  nameEventSocket:string;
  idGrupo:string;
  limit:number  = 5;
  offset:number = 0;
  visibleModalFecha:boolean;
  formFecha:FormGroup;
  dataEstudianteMessage:Estudiante;

  /** Variables pago extemporaneo */
  estudianteEnGrupo:EstudianteEnGrupo;
  grupoModulo:GrupoModulo[] = [];
  refDialog: DynamicDialogRef;

  /** Estado estudiante */
  loadingSaveEstadoEstudiante:boolean = false;
  modalEstadoEstudiante:boolean = false;
  estadoEstudiante:string;
  optionEstadoEstudiante:EstadoMatricula[] = [];
  matriculaSecionada:Matricula;

  constructor(private readonly dialogService: DialogService,
              private readonly _grupo:GrupoService,
              private readonly fb:FormBuilder,
              private readonly activeRoute:ActivatedRoute,
              private readonly _socket:SocketService,
              private readonly _unAuth:UnAuthorizedService,
              private readonly _global: GlobalService,
              private readonly router:Router,
              private readonly _matricula:MatriculaService,
              private readonly confirService:ConfirmationService,
              private _msg:MessageService) {
                this.getIdGrupo(this.activeRoute);
                this.onListaEstudiantesCurso();
                this.createFormFecha();
   }

  ngOnInit(): void {
    this.nameEventSocket = 'updated_list_estudiante_grupo';
    this.visibleModalFecha = false;
    this.optionEstadoEstudiante = [
      { value:'Matriculado', code:'matriculado' },
      { value:'Retirado', code:'retirado' }
    ];
  }

  createFormFecha(){
    this.formFecha = this.fb.group({
      Id:[null, Validators.required],
      CurrentModulo:[null, Validators.required],
      FechaPago:[null, Validators.required],
      FechaFinalModulo:[null, Validators.required],
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
        if(value.ok){
          this.resAlumnoEnGrupo = value;
          this.grupo = value.data.grupo;
          this.grupoModulo = this.grupo.grupoModulo;
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
    this.modalMensualidad.openModal(pago,
                                    new PayloadSocket(this.limit, this.offset, this.idGrupo),
                                    this.grupo.grupoModulo);
  }

  opendModalEdit(data:GrupoModulo, Id:number, updateFechaInicio:boolean){
    this.updateFechaInicio = updateFechaInicio;
    const fechaPago = data.FechaPago;
    const fechaFinalModulo = data.FechaFinalModulo;

    data.FechaPago = (moment(data.FechaPago)).toDate()
    data.FechaFinalModulo = (moment(data.FechaFinalModulo)).toDate()
    data.grupo = { Id } as Grupo;
    this.formFecha.patchValue(data);
    this.visibleModalFecha = true;
  }

  estadoModalFecha(estado:boolean){
    this.visibleModalFecha = estado;
  }

  openModalSidebarMessage(estudiante:Estudiante){
    this.openSidebarMessage = true;
    this.dataEstudianteMessage = estudiante;
  }

  openModalAddPagoExtemporaneo(estudianteEnGrupo:EstudianteEnGrupo){
    const width = window.innerWidth < 768 ? '90%' : '40%';

    this.estudianteEnGrupo = estudianteEnGrupo;
    this.refDialog = this.dialogService.open(ModalPagoExtemporaneoComponent,{
      data: {
        estudianteEnGrupo:this.estudianteEnGrupo,
        grupoModulo:this.grupoModulo
      },
      header:'Agregar pago extemporáneo (mora)',
      width: width,
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
    });
    // verificar si se cerró el modal
    this.refDialog.onClose.subscribe((result) => {
      this._socket.EmitEvent('updated_list_estudiante_grupo', { Id:this.idGrupo, limit:this.limit, offset:this.offset });
    });
  }

  estadoModalMessage(estado:boolean){
    this.openSidebarMessage = estado;
  }

  confirmarEliminar({ estudiante, Id}:EstudianteEnGrupo){

    this.confirService.confirm({
        message: `¿Está seguro de eliminar del grupo al estudiante <b>${estudiante.Nombres}</b>?<br>
                  Una vez confirmado los registros del estudiante permanecerá pero no se mostrará`,
        header: `Confirmación de la eliminación`,
        icon: 'pi pi-info-circle',
        accept: () => {
          this._grupo.deleteEstudianteEnGrupoEspecifico(Id).subscribe({
            next:(value) => {
              if(value.ok){
                this.toast('success', value.msg);
                this._socket.EmitEvent('updated_list_estudiante_grupo', { Id:this.idGrupo, limit:this.limit, offset:this.offset });
                return;
              }
              this.toast('warn', value.msg);
            },
            error:(e) => {
              console.log(e)
              this.messageError(e)
            }
          })
        },
        reject: (type:any) => {
          console.log("No eliminar");
        },
        key: "deleteEstudentGrupoDialog"
    });
  }

  confirmarEliminarPago({ Id }:Pago){
    this.confirService.confirm({
      message: `¿Está seguro de eliminar este pago con Id <b>${Id}</b>?<br>
                Una vez confirmado, los registros permanecerán pero no se mostrará ni tomados en cuenta`,
      header: `Confirmación de la eliminación`,
      icon: 'pi pi-info-circle',
      accept: () => {
        this._grupo.deletePago(Id).subscribe({
          next:(value) => {
            if(value.ok){
              this.toast('success', value.msg);
              this._socket.EmitEvent('updated_list_estudiante_grupo', { Id:this.idGrupo, limit:this.limit, offset:this.offset });
              return;
            }
            this.toast('warn', value.msg);
          },
          error:(e) => {
            console.log(e)
            this.messageError(e)
          }
        })
      },
      reject: (type:any) => {
        console.log("No eliminar");
      },
      key: "deletePagoDialog"
    });
  }

  onListaEstudiantesCurso(){
    this._socket.OnEvent('list_estudian_en_grupo').subscribe({
      next:(value) => {
        this.grupo = value.data.grupo;
        this.grupoModulo = this.grupo.grupoModulo;
        this.listaEstudiantes = value.data.estudiantesEnGrupo;
      },
      error:(e) => {
        console.log(e)
        this.messageError(e)
      }
    })
  }

  /**
   *
   * Mora
   *
   */

  confirmValidarMora(mora:Mora, Verificado:boolean){
    this.confirService.confirm({
      message: `<b>¿Está seguro de ${Verificado?'validar':'invalidar'} la mora del estudiante?</b><br>
                Una vez confirmado, el estudiante ${Verificado?'es':'no es'} subsanado de la mora de ese módulo`,
      header: `Confirmación de validación de mora`,
      icon: 'pi pi-info-circle',
      accept: () => {
        this.validarMora(mora.Id, Verificado);
      },
      reject: (type:any) => {
        console.log("No eliminar");
      },
      key: "confirmValidarMoraDialog"
    });
  }

  confirmEliminarMora(mora:Mora){
    this.confirService.confirm({
      message: `<b>¿Está seguro de eliminar la mora del estudiante?</b><br>
                Una vez confirmado, el estudiante no contará con esa mora del módulo escrito mora de ese módulo`,
      header: `Confirmación de eiminación de mora`,
      icon: 'pi pi-info-circle',
      accept: () => {
        this.eliminarMora(mora.Id);
      },
      reject: (type:any) => {
        console.log("No eliminar");
      },
      key: "confirmEliminarMoraDialog"
    });
  }

  validarMora(Id:number, Verificado:boolean){
    this._grupo.updateMora(Id,{ Verificado } as Mora).subscribe({
      next:(value) => {
        if(value.ok){
          this.toast('success', value.msg);
          this._socket.EmitEvent('updated_list_estudiante_grupo', { Id:this.idGrupo, limit:this.limit, offset:this.offset });
          return;
        }
        this.toast('warn', value.msg);
      },
      error:(e) => {
        console.log(e)
        this.messageError(e)
      }
    })
  }

  eliminarMora(Id:number){
    this._grupo.deleteMora(Id).subscribe({
      next:(value) => {
        if(value.ok){
          this.toast('success', value.msg);
          this._socket.EmitEvent('updated_list_estudiante_grupo', { Id:this.idGrupo, limit:this.limit, offset:this.offset });
          return;
        }
        this.toast('warn', value.msg);
      },
      error:(e) => {
        console.log(e)
        this.messageError(e)
      }
    })
  }

  moreInformacionEstudiante(estudiante:Estudiante){
    this.router.navigate(['/system/grupos/estudiante-en-grupo', this.idGrupo, estudiante.Id]);
  }

  openModalEstadoEstudiante(matricula:Matricula){
    this.matriculaSecionada = matricula;
    this.estadoEstudiante = matricula.EstadoMatricula;
    this.modalEstadoEstudiante = true;
  }

  saveEstadoEstudiante(){
    if(!this.estadoEstudiante){
      this.toast('warn','Selecione un estado del estudiante para continuar');
    }
    this._matricula.updateMatricula(this.matriculaSecionada.Id, {EstadoMatricula: this.estadoEstudiante } as Matricula).subscribe({
      next:(resp)=>{
        if(resp.ok){
          this.toast('success', resp.msg,'Actualización del estado del estudiante');
          this._socket.EmitEvent('updated_list_estudiante_grupo', { Id:this.idGrupo, limit:this.limit, offset:this.offset });
          this.modalEstadoEstudiante = false;
        }
      },
      error:(e)=>{
        this.messageError(e);
      }
    })
  }

  messageError(e:HttpErrorResponse){
    if(e.status==401) return;
    const msg = e.error.message;
    Array.isArray(msg)?msg.forEach((e) => this.toast('error',e,'Error de validación de datos')):
                                          this.toast('error',msg,`${e.error.error}:${e.error.statusCode}`)
  }

  toast(type:string, msg:string, detail?:string){
    this._msg.add({severity:type, summary:msg, detail});
  }


}
