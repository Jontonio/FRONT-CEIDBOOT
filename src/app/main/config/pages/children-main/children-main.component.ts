import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfigService } from '../../services/config.service';
import { MessageService } from 'primeng/api';
import { HttpErrorResponse } from '@angular/common/http';
import { UnAuthorizedService } from 'src/app/services/unauthorized.service';

@Component({
  selector: 'app-children-main',
  templateUrl: './children-main.component.html',
  styleUrls: ['./children-main.component.scss']
})
export class ChildrenMainComponent {

  formEstadoGrupo:FormGroup;
  sidebarVisible:boolean;
  isUpdateEstadoGrupo:boolean;
  loadingEstadoGrupo:boolean;

  constructor(private readonly fb:FormBuilder,
              private _msg:MessageService,
              private _unAuth:UnAuthorizedService,
              private readonly _config:ConfigService) {
    this.inicializedVariables();
    this.createFormEstadoGrupo();
  }

  /** crear el formulario */
  createFormEstadoGrupo(){
    this.formEstadoGrupo = this.fb.group({
      EstadoGrupo:[null, Validators.required],
      CodeEstado:[null, Validators.required],
      DescripcionEstadoGrupo:[null, Validators.required]
    })
  }

  inicializedVariables(){
    this.sidebarVisible = false;
    this.isUpdateEstadoGrupo = false;
    this.loadingEstadoGrupo = false;
  }

  /** getters */
  get EstadoGrupo(){
    return this.formEstadoGrupo.controls['EstadoGrupo'];
  }
  get DescripcionEstadoGrupo(){
    return this.formEstadoGrupo.controls['DescripcionEstadoGrupo'];
  }
  get CodeEstado(){
    return this.formEstadoGrupo.controls['CodeEstado'];
  }

  /** guarda el estado del grupo */
  saveEstadoGrupo(){

    if(this.formEstadoGrupo.invalid) {
      Object.keys( this.formEstadoGrupo.controls ).forEach( label => this.formEstadoGrupo.controls[ label ].markAsDirty())
      return;
    }

    this.loadingEstadoGrupo = true;

    this._config.createEstadoGrupo(this.formEstadoGrupo.value).subscribe({
      next:(value) => {
        this.loadingEstadoGrupo = false;
        if(value.ok){
          this.formEstadoGrupo.reset();
          this.sidebarVisible = false;
          this.toast('success', value.msg);
          return;
        }
        this.toast('warn', value.msg);
      },
      error:(e) => {
        this.loadingEstadoGrupo = false;
        this.messageError(e);
      }
    })

  }

  /** funcion para abrir el sidebar */
  showSideBar(){
    this.sidebarVisible = true
  }

  createCodeEstado(name:string){
    if(!name) return;
    let initial = 'STATUS_';
    initial = `${initial}${name.replace(' ','_')}`;
    this.CodeEstado.setValue(initial);
  }

  messageError(e:HttpErrorResponse){
    this._unAuth.unAuthResponse(e);
    const msg = e.error.message;
    Array.isArray(msg)?msg.forEach((e) => this.toast('error',e,'Error de validación de datos')):
                                          this.toast('error',msg,`${e.error.error}:${e.error.statusCode}`)
  }

  toast(severity:string, summary:string, detail:string=''){
    this._msg.add({severity, summary, detail});
  }


}
