import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Grupo, ResGetGrupo, ResGrupo } from 'src/app/main/class/Grupo';
import { GrupoService } from 'src/app/main/services/grupo.service';

export interface Modalidad {
  name:string,
  code:string;
}

@Component({
  selector: 'app-grupo',
  templateUrl: './grupo.component.html',
  styleUrls: ['./grupo.component.scss']
})

export class GrupoComponent implements OnInit {

  modalidad:Modalidad [] = [];
  modalHorario:boolean = false;
  FormHorario:FormGroup;
  FormGrupo:FormGroup;
  loadHorario:boolean = false;
  listGrupos:Grupo[] = [];
  startPage:number = 0;
  resGetGrupo:ResGetGrupo;
  changePage:boolean = false;
  loadding:boolean = false;

  constructor(private _msg:MessageService,
              private fb: FormBuilder,
              private _grupo:GrupoService) {

    this.createFormHorario();
    this.createFormGrupo();

  }

  ngOnInit(): void {

    this.modalidad = [
      { name:'Presencial', code:'presencial'},
      { name:'Virtual', code:'virtual'},
      { name:'Presencial-Virtual', code:'presencial-virtual'}
    ]

  }

  createFormHorario(){

    this.FormHorario = this.fb.group({
      HoraInicio:[null, [Validators.required ]],
      HoraFinal:[null, [Validators.required]],
      DescHorario:[null]
    })

  }

  createFormGrupo(){

    this.FormGrupo = this.fb.group({
      NombreGrupo:[null, [Validators.required ]],
      DescGrupo:[null]
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

  /** Getters Form Grupo */
  get NombreGrupo(){
    return this.FormGrupo.controls['NombreGrupo'];
  }
  get DescGrupo(){
    return this.FormGrupo.controls['DescGrupo'];
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

  saveGrupo(){

    if(this.FormGrupo.invalid){

      Object.keys( this.FormGrupo.controls ).forEach( input => {
        this.FormGrupo.controls[input].markAsDirty();
      });

      return;
    }

    this.loadHorario = true;

    this._grupo.createGrupo(this.FormGrupo.value).subscribe({
      next: (resp) => {
        this.loadHorario = false;
        if(resp.ok){
          this.resetGrupo();
          this.toast('success',resp.msg);
        }else{
          this.toast('warn',resp.msg,'Registre un nuevo grupo con un nombre diferente');
        }
      },
      error: (err) => {
        this.loadHorario = false;
        err.error.message.forEach( (msg:string) => {
          this.toast('warn', msg,'Error al registrar un nuevo grupo');
        });
      },
    })

  }

  resetGrupo(){
    this.FormGrupo.reset();
  }

  resetHorario(){

    this.FormHorario.reset();
    this.openModal();

  }

  paginate(event:any) {
    this.changePage = true;

    this.startPage = event.first;
    // this._docente.getAllDocentes(event.rows, event.first).subscribe({
    //   next: (value) => {
    //     this.resGetDocente = value;
    //     this.listDocentes = value.data;
    //   },
    //   error: (err) => {
    //     console.log(err);
    //   },
    // });

  }

  openModal(){
    this.modalHorario = !this.modalHorario;
  }

  toast(type:string, msg:string, detail:string=''){
    this._msg.add({severity:type, summary:msg, detail});
  }

}
