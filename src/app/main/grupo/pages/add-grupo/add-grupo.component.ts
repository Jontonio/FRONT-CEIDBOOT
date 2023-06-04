import { Component, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { FormGrupoComponent } from '../../components/form-grupo/form-grupo.component';
import { ModalHorarioComponent } from '../../components/modal-horario/modal-horario.component';
import { ModalTipoGrupoComponent } from '../../components/modal-tipo-grupo/modal-tipo-grupo.component';

import { GrupoService } from '../../services/grupo.service';
import { optionOperation } from 'src/app/main/class/global';
import { SocketService } from 'src/app/services/socket.service';
import { Grupo } from '../../class/Grupo';

@Component({
  selector: 'app-add-grupo',
  templateUrl: './add-grupo.component.html',
  styleUrls: ['./add-grupo.component.scss']
})
export class AddGrupoComponent {

  /** Variables ViewChild*/
  @ViewChild(ModalHorarioComponent) modalHorario:ModalHorarioComponent;
  @ViewChild(ModalTipoGrupoComponent) modalTGHorario:ModalTipoGrupoComponent;
  @ViewChild(FormGrupoComponent) formGrupo:FormGrupoComponent;

  /** Variables de clase */
  loading:boolean = false;

  constructor(private readonly _grupo:GrupoService,
              private readonly _msg:MessageService,
              private readonly _socket:SocketService){}

  openModalHorario(){
    this.modalHorario.openModal();
  }

  openModalTGrupo(){
    this.modalTGHorario.openModal();
  }

  messageError(e:any){
    const msg = e.error.message;
    Array.isArray(msg)?msg.forEach((e) => this.toast('error',e,'Error de validación de datos')):
                                          this.toast('error',msg,`${e.error.error}:${e.error.statusCode}`)
  }

  toast(severity:string, summary:string, detail:string=''){
    this._msg.add({severity, summary, detail});
  }

  createGrupo(opt:optionOperation){
    this._grupo.createGrupo(opt.data as Grupo).subscribe({
      next: (resp) => {
        setTimeout(() => {
          this.loading = false;
          if(!resp.ok){
            this.toast('warn', resp.msg);
            return;
          }
          this.formGrupo.resetGrupo()
          this._socket.EmitEvent('updated_list_grupo');
          this.toast('success', resp.msg);
        },200);
      },
      error: (e) => {
        this.loading = false;
        this.messageError(e);
      }
    })
  }

  updateGrupo(opt:optionOperation){
    this._grupo.updateGrupo(opt.Id!, opt.data as Grupo).subscribe({
      next: (resp) => {
        setTimeout(() => {
          this.loading = false;
          if(!resp.ok){
            this.toast('warn', resp.msg);
            return;
          }
          this.formGrupo.returnLista()
          this._socket.EmitEvent('updated_list_grupo');
          this.toast('success',resp.msg);
        },200);
      },
      error: (e) => {
        this.loading = false;
        this.messageError(e);
      }
    })
  }

  saveGrupo(opt:optionOperation){
    this.loading = true;
    opt.option?this.updateGrupo(opt):this.createGrupo(opt);
  }

}
