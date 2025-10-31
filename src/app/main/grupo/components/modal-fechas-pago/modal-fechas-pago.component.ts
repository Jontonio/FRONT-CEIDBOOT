import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { GrupoService } from '../../services/grupo.service';
import { MessageService } from 'primeng/api';
import { HttpErrorResponse } from '@angular/common/http';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-modal-fechas-pago',
  templateUrl: './modal-fechas-pago.component.html',
  styleUrls: ['./modal-fechas-pago.component.scss']
})
export class ModalFechasPagoComponent implements OnInit {

  @Input() formFecha:UntypedFormGroup;
  @Input() visibleModal:boolean;
  @Output() estadoModal = new EventEmitter<boolean>();
  @Input() updateFechaInicio:boolean;
  date:Date;

  constructor(private readonly _grupo:GrupoService,
              private readonly _socket:SocketService,
              private _msg:MessageService) { }

  ngOnInit(): void {
    this.visibleModal = false;
  }

  // getters
  get Id(){
    return this.formFecha.controls['Id'];
  }
  get CurrentModulo(){
    return this.formFecha.controls['CurrentModulo'];
  }
  get FechaPago(){
    return this.formFecha.controls['FechaPago'];
  }
  get FechaFinalModulo(){
    return this.formFecha.controls['FechaFinalModulo'];
  }
  get modulo(){
    return this.formFecha.controls['modulo'];
  }
  get grupo(){
    return this.formFecha.controls['grupo'];
  }

  openModal(){
    this.visibleModal = true;
  }

  closeModal(){
    this.visibleModal = false;
    this.estadoModal.emit(this.visibleModal);
  }

  saveChanges(){
    this._grupo.updateGrupoModulo(this.Id.value, this.formFecha.value).subscribe({
      next:(res) => {
        if(res.ok){
          this.toast('success', res.msg);
          this._socket.EmitEvent('updated_list_estudiante_grupo',{ Id:this.grupo.value.Id })
          this.closeModal();
          return;
        }
        this.toast('warn', res.msg);
      },
      error:(e) => {
        console.log(e)
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
