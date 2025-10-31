import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Dropdown } from 'primeng/dropdown';
import { GrupoService } from 'src/app/main/grupo/services/grupo.service';
import { SocketService } from 'src/app/services/socket.service';
import { Matricula } from '../../class/Matricula';
import { Servicio } from '../../class/Servicio';
import { MatriculaService } from '../../services/matricula.service';
import { ShowFileComponent } from 'src/app/shared/show-file/show-file.component';
import { Estudiante } from '../../class/Estudiante';
import { ModalInfoEstudianteComponent } from 'src/app/main/shared/modal-info-estudiante/modal-info-estudiante.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-list-matricula',
  templateUrl: './list-matricula.component.html',
  styleUrls: ['./list-matricula.component.scss']
})
export class ListMatriculaComponent implements OnInit {

  @ViewChildren('elemento') dropdowns:QueryList<Dropdown>;
  @ViewChild(ShowFileComponent) showFileComponent:ShowFileComponent;

  /** Variables de clase */
  startPage:number = 0;
  position:string;
  moreInfo:boolean = false;
  moreInfoMatricula:boolean = false;
  description:string;
  infoMatricula:Matricula;
  listAddEnGrupo:any[] = [];
  loadingSave:boolean = false;
  visibleAsignarGrupo:boolean = false;
  formSelectGrupo:UntypedFormGroup;
  FileMatriculaURL:string;
  openSidebarMessage:boolean = false;
  dataEstudianteMessage:Estudiante;
  termino:string;
  refDialog: DynamicDialogRef;
  limit:number  = 5;
  offset:number = 0;

  constructor(private readonly dialogService: DialogService,
              private readonly _msg:MessageService,
              public readonly _matricula:MatriculaService,
              private readonly _socket:SocketService,
              public readonly _grupo:GrupoService,
              public readonly _confirService:ConfirmationService) {}

  ngOnInit(): void {}

  paginate(event:any) {
    this.startPage = event.first;
    this.limit = event.rows;
    this.offset = event.first;
    this._matricula.getListaMatriculados(this.limit, this.offset);
  }

  dialogDelete(matricula:Matricula) {
    this.position = 'top';
    this._confirService.confirm({
        message: `¿Está seguro de eliminar al preinscrito?. Una vez eliminado no habrá registros de la persona</span>`,
        header: 'Confirmación de eliminar al preinscrito',
        icon: 'pi pi-info-circle',
        accept: () => {
          this.deleteMatriculado(matricula.Id);
        },
        reject: (type:any) => {
          console.log("No eliminar");
        },
        key: "deleteMatriculadoDialog"
    });
  }

  deleteMatriculado(Id:number){
    this._matricula.removeMatriculado(Id).subscribe({
      next: (value) => {
        if(value.ok){
          this.toast('success', value.msg);
          this._socket.EmitEvent('updated_list_matriculados');
        }
      },
      error: (e) => {
        console.log(e)
        this.messageError(e);
      }
    })
  }

  moreService(servicio:Servicio){
    this.moreInfo = true;
    this.description = servicio.Descripcion;
  }

  updateEstadoModalInfo(estado:boolean){
    this.moreInfoMatricula = estado;
  }

  moreInfoEstudiante(matricula:Matricula){
    this.moreInfoMatricula = true;
    this.infoMatricula = matricula;

    this.infoMatricula = matricula;

    const width = window.innerWidth < 768 ? '95%' : '70%';

    this.refDialog = this.dialogService.open(ModalInfoEstudianteComponent,{
      data: {
        infoMatricula:this.infoMatricula,
      },
      header:`Información de ${this.infoMatricula.estudiante.Nombres}`,
      width: width,
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
    });

    // verificar si se cerró el modal
    this.refDialog.onClose.subscribe((result) => {
      this._socket.EmitEvent('updated_list_matriculados', { limit:this.limit, offset:this.offset });
    });
  }

  deleteDuplicate(list:any[], data:any){
    const i = list.findIndex( item => item.matricula.Id==data.matricula.Id)
    return list.splice(i, 1);
  }

  deleteUndefined(list:any[]){
    return list.filter(item => item.grupo.Id!==undefined);
  }

  showFile(matricula:Matricula){
    this.showFileComponent.showModal();
    this.showFileComponent.showSpinner();
    this.FileMatriculaURL = matricula.FileMatriculaURL;
  }

  save({Id, estudiante }:Matricula){

    let IdGrupo:number | undefined;
    this.loadingSave = true;

    this.dropdowns.toArray().forEach( element => {
      if(element.name===`elemento${Id}`){
        if(element.value){
          IdGrupo = element.value.Id;
        }
        return;
      }
    })

    if(IdGrupo){
      const data:any = { grupo: {'Id': IdGrupo }, matricula:{'Id':Id}, estudiante:{'Id':estudiante.Id }};
      this._matricula.addAlumnoEnGrupo( data ).subscribe({
        next: (value) => {
          if(value.ok){
            this.toast('success', value.msg)
            this._socket.EmitEvent('updated_list_matriculados');
            this._socket.EmitEvent('updated_list_grupo');
          }else{
            this.toast('warn', value.msg)
          }
          this.loadingSave = false;
        },
        error: (e) => {
          this.loadingSave = false;
          console.log(e)
        }
      })
    }else{
      this.toast('warn','Es necesario selecionar un grupo para asignar al estudiante')
      this.loadingSave = false;
    }

  }

  busquedaTermino(termino:string){
    this.termino = termino;
  }

  notificarEstudiante(estudiante:Estudiante): void {
    this.openSidebarMessage = true;
    this.dataEstudianteMessage = estudiante;
  }

  estadoModalMessage(estado:boolean){
    this.openSidebarMessage = estado;
  }

  toast(severity:string, summary:string, detail:string=''){
    this._msg.add({severity, summary, detail});
  }

  messageError(e:any){
    const msg = e.error.message;
    Array.isArray(msg)?msg.forEach( (e:string) => this.toast('error', e, 'Error de validación de datos')):
                                                  this.toast('error', msg,`${e.error.error}:${e.error.statusCode}`)
  }

}
