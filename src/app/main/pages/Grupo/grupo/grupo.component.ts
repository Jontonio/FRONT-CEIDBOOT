import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Grupo, ResGetGrupo, ResGrupo } from 'src/app/main/class/Grupo';
import { GrupoService } from 'src/app/main/services/grupo.service';


@Component({
  selector: 'app-grupo',
  templateUrl: './grupo.component.html',
  styleUrls: ['./grupo.component.scss']
})

export class GrupoComponent implements OnInit {

  FormHorario:FormGroup;
  loadHorario:boolean = false;
  modalHorario:boolean = false;

  constructor(private fb: FormBuilder,
              private _grupo:GrupoService,
              private _msg:MessageService,) {

    this.createFormHorario();

  }

  ngOnInit(): void {}

  createFormHorario(){

    this.FormHorario = this.fb.group({
      HoraInicio:[null, [Validators.required ]],
      HoraFinal:[null, [Validators.required]],
      DescHorario:[null]
    })

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
          this.resetHorario();
          this.toast('success',resp.msg);
        }
      },
      error: (err) => {
        this.loadHorario = false;
        err.error.message.forEach( (msg:string) => {
          this.toast('warn', msg,'Error al registrar un nuevo horario');
        });
      },
    })

  }

  resetHorario(){
    this.FormHorario.reset();
    this.openModal();
  }

  openModal(){
    this.modalHorario = !this.modalHorario;
  }

  toast(type:string, msg:string, detail:string=''){
    this._msg.add({severity:type, summary:msg, detail});
  }


}
