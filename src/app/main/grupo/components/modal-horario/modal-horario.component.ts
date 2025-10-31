import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { SocketService } from 'src/app/services/socket.service';
import { GrupoService } from '../../services/grupo.service';

@Component({
  selector: 'app-modal-horario',
  templateUrl: './modal-horario.component.html',
  styleUrls: ['./modal-horario.component.scss']
})
export class ModalHorarioComponent implements OnInit {

  openModalHorario:boolean;
  FormHorario:UntypedFormGroup;
  loadHorario:boolean = false;

  constructor(private fb:UntypedFormBuilder,
              private _grupo:GrupoService,
              private _socket:SocketService,
              private _msg:MessageService) {}

  ngOnInit(): void {
    this.createFormHorario();
  }

  createFormHorario(){
    this.FormHorario = this.fb.group({
      HoraInicio:[null, [Validators.required ]],
      HoraFinal:[null, [Validators.required]],
      DescHorario:[null]
    })
  }

  closeModal(){
    this.openModalHorario = false;
    this.resetHorario();
  }

  openModal(){
    this.openModalHorario = true;
  }


  /** Getters Form Horario */
  get HoraInicio(){
    return this.FormHorario.controls['HoraInicio']
  }
  get HoraFinal(){
    return this.FormHorario.controls['HoraFinal']
  }
  get DescHorario(){
    return this.FormHorario.controls['DescHorario']
  }

  saveHorario(){

    if(this.FormHorario.invalid){

      Object.keys( this.FormHorario.controls ).forEach( input => {
        this.FormHorario.controls[input].markAsDirty();
      });

      return;
    }

    this.loadHorario = true;

    this._grupo.createHorario(this.FormHorario.value).subscribe({
      next: (resp) => {
        this.loadHorario = false;
        if(resp.ok){
          this._socket.EmitEvent('updated_list_horario');
          this.closeModal();
          this.toast('success',resp.msg);
        }
      },
      error: (e) => {
        this.loadHorario = false;
        this.messageError(e);
      }
    })

  }

  resetHorario(){
    this.FormHorario.reset();
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
