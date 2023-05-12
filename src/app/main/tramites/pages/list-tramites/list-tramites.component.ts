import { Component, OnInit, ViewChild } from '@angular/core';
import { TramiteService } from '../../services/tramite.service';
import { Tramite } from 'src/app/class/Tramite';
import { ShowFileComponent } from 'src/app/shared/show-file/show-file.component';
import { Subscription } from 'rxjs';
import { ConfirmationService, MessageService } from 'primeng/api';
import { SocketService } from 'src/app/services/socket.service';
import { ModalMensualidadComponent } from 'src/app/main/grupo/components/modal-mensualidad/modal-mensualidad.component';
import { Pago } from 'src/app/main/grupo/class/Pago';
import { PayloadSocket } from 'src/app/class/PayloadSocket';
import { Estudiante } from 'src/app/main/matricula/class/Estudiante';

@Component({
  selector: 'app-list-tramites',
  templateUrl: './list-tramites.component.html',
  styleUrls: ['./list-tramites.component.scss']
})
export class ListTramitesComponent implements OnInit {

  @ViewChild(ModalMensualidadComponent) modalValidarPago:ModalMensualidadComponent;

  termino:string;
  startPage:number = 0;
  fileURL:string;
  deleteTramite$:Subscription;
  nameEventSocketUpdate:string;
  openSidebar:boolean;
  dataEstudianteMessage:Estudiante;

  limit:number = 5;
  offset:number = 0;

  @ViewChild(ShowFileComponent) showFileComponent:ShowFileComponent;

  constructor( public readonly _tramite:TramiteService,
               private readonly _socket:SocketService,
               private readonly confirService:ConfirmationService,
               private _msg:MessageService) { }

  ngOnInit(): void {
    this.nameEventSocketUpdate = 'updated_list_tramites';
    this.openSidebar = false;
  }

  ngOnDestroy(): void {
    if(this.deleteTramite$) this.deleteTramite$.unsubscribe();
  }

  paginate(event:any) {
    this.startPage = event.first;
    this.limit = event.rows;
    this.offset = event.first;
    this._tramite.getListaTramites(event.rows, event.first);
  }

  showFileDocumento(tramite:Tramite){
    this.showFileComponent.showModal();
    this.showFileComponent.showSpinner();
    this.fileURL = tramite.UrlRequisito;
  }
  showFileDocumentoExtra(tramite:Tramite){
    this.showFileComponent.showModal();
    this.showFileComponent.showSpinner();
    this.fileURL = tramite.UrlRequisitoExtra;
  }

  confirmDeleteTramite({ estudiante, Id }:Tramite){
    this.confirService.confirm({
      message: `¿Está seguro de eliminar el trámite de <b>${estudiante.Nombres}</b>?`,
      header: 'Confirmación de eliminar',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.deleteTramite(Id);
      },
      reject: (type:any) => console.log("No eliminar"),
      key: "deleteTramiteDialog"
    });
  }

  deleteTramite(Id:number){
    this.deleteTramite$ = this._tramite.deleteTramite(Id).subscribe({
      next: (value) => {
        if(!value.ok){
          return;
        }
        this.toast('success', 'Eliminación', value.msg);
        this._socket.EmitEvent('updated_list_tramites',{ limit:this.limit, offset: this.offset });
      },
      error: (e) => {
        console.log(e);
        this.messageError(e);
      }
    })
  }

  notificarEstudiante(estudiante:Estudiante){
    this.openSidebar = true;
    this.dataEstudianteMessage = estudiante;
  }

  openModalValidarPago(pago:Pago){
    this.modalValidarPago.openModal(pago, new PayloadSocket(this.limit, this.offset));
  }

  estadoModalMessage(estado:boolean){
    this.openSidebar = estado;
    console.log(estado)
  }

  busquedaTermino(termino:string){
    this.termino = termino;
  }

  toast(severity:string, summary:string, detail?:string){
    this._msg.add({severity, summary, detail});
  }

  messageError(e:any){
    const msg = e.error.message;
    Array.isArray(msg)?msg.forEach(e => this.toast('error', e, 'Error de validación de datos')):
                                        this.toast('error', msg, `${e.error.error}:${e.error.statusCode}`)
  }

}
