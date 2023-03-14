import { Component, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Docente } from 'src/app/main/docente/class/Docente';
import { DocenteService } from 'src/app/main/docente/services/docente.service';
import { SocketService } from 'src/app/services/socket.service';
import { FormDocenteComponent } from 'src/app/main/docente/components/form-docente/form-docente.component';
import { optionOperation } from 'src/app/main/class/global';
import { Router } from '@angular/router';
import { GlobalService } from 'src/app/services/global.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-add-docente',
  templateUrl: './add-docente.component.html',
  styleUrls: ['./add-docente.component.scss']
})
export class AddDocenteComponent {

  @ViewChild(FormDocenteComponent) hijo:FormDocenteComponent;

  private updateDocente$:Subscription;
  private createDocente$:Subscription;

  loadding:boolean = false;
  urlLista:string = '/system/docentes/lista-docentes'

  constructor(private route:Router,
              private _msg:MessageService,
              private _docente:DocenteService,
              private _global:GlobalService,
              private _socket: SocketService) {
              this._global.parseURL(this.route);
              }

  save(opt:optionOperation){
    this.loadding = true;
    if(opt.option){
      this.updateDocente$ = this._docente.updateDocente(opt.Id!, opt.data as Docente).subscribe({
        next: (value) => {
          this.loadding = false;
          if(value.ok){
            this._socket.EmitEvent('updated_list_docente');
            this.toast('success', value.msg);
            this.route.navigate([this.urlLista]);
          }
          this.updateDocente$.unsubscribe();
        },
        error: (e) => {
          console.log(e);
          this.loadding = false;
          this.messageError(e);
        },
      })
    }else{
      this.createDocente$ = this._docente.createDocente(opt.data as Docente).subscribe({
        next: (value) => {
         setTimeout(() => {
            this.loadding = false;
            if(value.ok){
              this._socket.EmitEvent('updated_list_docente');
              this.toast('success', value.msg);
              this.hijo.resetForm();
            }else{
              this.toast('error', value.msg)
            }
            this.createDocente$.unsubscribe();
         },200);
        },
        error: (e) => {
          this.loadding = false;
          console.log(e);
          this.messageError(e);
        }
      });
    }
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
