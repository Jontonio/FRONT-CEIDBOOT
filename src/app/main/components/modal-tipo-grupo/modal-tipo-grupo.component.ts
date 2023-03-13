import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { SocketService } from 'src/app/services/socket.service';
import { GrupoService } from '../../services/grupo.service';

@Component({
  selector: 'app-modal-tipo-grupo',
  templateUrl: './modal-tipo-grupo.component.html',
  styleUrls: ['./modal-tipo-grupo.component.scss']
})
export class ModalTipoGrupoComponent {

  FormTipoGrupo:FormGroup;
  loadHorario:boolean = false;
  openModalTGrupo:boolean = false;

  constructor(private fb:FormBuilder,
              private _grupo:GrupoService,
              private _msg:MessageService,
              private _socket:SocketService) {
    this.createFormTipoGrupo();
  }

  openModal(){
    this.openModalTGrupo = true;
  }

  closeModal(){
    this.openModalTGrupo = false;
    this.FormTipoGrupo.reset();
  }

  createFormTipoGrupo(){
    this.FormTipoGrupo = this.fb.group({
      NombreGrupo:[null, [Validators.required ]],
      DescGrupo:[null],
    })
  }

  /** Getters Form Tipo Grupo */
  get NombreGrupo(){
    return this.FormTipoGrupo.controls['NombreGrupo'];
  }
  get DescTipGrupo(){
    return this.FormTipoGrupo.controls['DescGrupo'];
  }

  saveTipoGrupo(){

    if(this.FormTipoGrupo.invalid){

      Object.keys( this.FormTipoGrupo.controls ).forEach( input => {
        this.FormTipoGrupo.controls[input].markAsDirty();
      });

      return;
    }

    this._grupo.createTipoGrupo(this.FormTipoGrupo.value).subscribe({
      next: (resp) => {
        if(resp.ok){
          this._socket.EmitEvent('updated_list_nombre_grupo');
          this.closeModal();
          this.toast('success',resp.msg);
        }else{
          this.toast('warn',resp.msg,'Registre un tipo de grupo diferente');
        }
      },
      error: (e) => this.messageError(e)
    })

  }

  resetTipoGrupo(){
    this.FormTipoGrupo.reset();
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
