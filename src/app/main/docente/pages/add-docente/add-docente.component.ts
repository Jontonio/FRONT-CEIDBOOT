import { Component, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Docente } from 'src/app/main/docente/class/Docente';
import { DocenteService } from 'src/app/main/docente/services/docente.service';
import { SocketService } from 'src/app/services/socket.service';
import { FormDocenteComponent } from 'src/app/main/docente/components/form-docente/form-docente.component';
import { optionOperation } from 'src/app/main/class/global';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-add-docente',
  templateUrl: './add-docente.component.html',
  styleUrls: ['./add-docente.component.scss']
})
export class AddDocenteComponent {

  /** Variables ViewChild */
  @ViewChild(FormDocenteComponent) hijo:FormDocenteComponent;

  /** Variables Subscription */
  private updateDocente$:Subscription;
  private createDocente$:Subscription;

  /** Variables de clase */
  loading:boolean = false;
  urlLista:string = '/system/docentes/lista-docentes'

  constructor(private route:Router,
              private _msg:MessageService,
              private _docente:DocenteService,
              private _socket: SocketService) {}

  ngOnDestroy(): void {
    if(this.createDocente$) this.createDocente$.unsubscribe();
    if(this.updateDocente$) this.updateDocente$.unsubscribe();
  }

  createDocente(opt:optionOperation){
    this.createDocente$ = this._docente.createDocente(opt.data as Docente).subscribe({
      next: (value) => {
       setTimeout(() => {
          this.loading = false;
          if(!value.ok){
            this.toast('error', value.msg)
            return;
          }
          this._socket.EmitEvent('updated_list_docente');
          this.toast('success', value.msg);
          this.hijo.resetForm();
       },200);
      },
      error: (e) => {
        this.loading = false;
        console.log(e);
        this.messageError(e);
      }
    });
  }

  updateDocente(opt:optionOperation){
    this.updateDocente$ = this._docente.updateDocente(opt.Id!, opt.data as Docente).subscribe({
      next: (value) => {
        this.loading = false;
        if(!value.ok){
          this.toast('error', value.msg)
          return;
        }
        this._socket.EmitEvent('updated_list_docente');
        this.toast('success', value.msg);
        this.route.navigate([this.urlLista]);
      },
      error: (e) => {
        console.log(e);
        this.loading = false;
        this.messageError(e);
      },
    })
  }

  save(opt:optionOperation){
    this.loading = true;
    opt.option?this.updateDocente(opt):this.createDocente(opt);
  }

  messageError(e:any){
    const msg = e.error.message;
    Array.isArray(msg)?msg.forEach((e:string) => this.toast('error', e, 'Error de validación de datos')):
                                                 this.toast('error', msg,`${e.error.error}:${e.error.statusCode}`)
  }

  toast(severity:string, summary:string, detail:string=''){
    this._msg.add({severity, summary, detail});
  }

}
