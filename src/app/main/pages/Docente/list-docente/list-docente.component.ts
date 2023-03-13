import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { Docente } from 'src/app/main/class/Docente';
import { DocenteService } from 'src/app/main/services/docente.service';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-list-docente',
  templateUrl: './list-docente.component.html',
  styleUrls: ['./list-docente.component.scss']
})
export class ListDocenteComponent {

  private deleteDocente$:Subscription;
  position :string;
  startPage:number = 0;

  constructor(public _docente:DocenteService,
              private _msg:MessageService,
              private _socket:SocketService,
              private _confirService:ConfirmationService,
              private route:Router) {}

  paginate(event:any) {
    this.startPage = event.first;
    this._docente.getListaDocentes(event.rows, event.first);
  }

  ngOnDestroy(): void {
    this._docente.listDocentes$.unsubscribe();
  }

  sendEditDocente({Id}:Docente){
    this.route.navigate(['/system/docentes/editar-docente', Id])
  }

  dialogDelete({ Nombres, Id}:Docente) {
    this.position = 'top';
    this._confirService.confirm({
        message: `¿Está seguro de eliminar al docente <b>${Nombres}</b>?`,
        header: 'Confirmación de eliminar',
        icon: 'pi pi-info-circle',
        accept: () => {
          this.deleteDocente$ = this._docente.deleteDocente(Id!).subscribe({
            next: (value) => {
              if(value.ok){
                this.toast('success', 'Eliminación', value.msg);
                this._socket.EmitEvent('updated_list_docente');
              }else{
                this.toast('warn', value.msg);
              }
              this.deleteDocente$.unsubscribe();
            },
            error: (e) => this.messageError(e)
          })
        },
        reject: (type:any) => {
          console.log("No eliminar");
        },
        key: "deleteDocenteDialog"
    });
  }

  messageError(e:any){
    if(Array.isArray(e.error.message)){
      e.error.message.forEach( (e:string) => {
        this.toast('error',e,'Error de validación de datos')
      })
    }else{
      this.toast('error',e.error.message,`${e.error.error}:${e.error.statusCode}`)
    }
  }

  toast(type:string, msg:string, detail:string=''){
    this._msg.add({severity:type, summary:msg, detail});
  }

}
