import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfigService } from '../../services/config.service';
import { MessageService } from 'primeng/api';
import { HttpErrorResponse } from '@angular/common/http';
import { UnAuthorizedService } from 'src/app/services/unauthorized.service';
import { EstadoGrupo } from 'src/app/main/grupo/class/EstadoGrupo';
import { CategoriaPago } from 'src/app/main/grupo/class/CategoriaPago';
import { TipoTramite } from 'src/app/main/class/TipoTramite';
import { MedioPago } from 'src/app/class/MedioDePago';
import { DenominServicio } from 'src/app/denomin-servicio/class/Denomin-servicio';

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
  products: any[];
  listEstadosGrupo:EstadoGrupo[] = [];
  listCategoriaspago:CategoriaPago[] = [];
  listTiposTramite:TipoTramite[] = [];
  listMediosPago:MedioPago[] = [];
  listDenominacionServicios:DenominServicio[] = [];

  constructor(private readonly fb:FormBuilder,
              private _msg:MessageService,
              private _unAuth:UnAuthorizedService,
              private readonly _config:ConfigService) {
    this.inicializedVariables();
    this.createFormEstadoGrupo();
    this.getAllEstadosGrupos();
    this.getAllCategoriasPago();
    this.getAllTiposTramite();
    this.getAllMediosPago();
    this.getAllDenominServicio();
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
    this.toast('succcess','OJO','no tocar','mensaje-advertencia');

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

  getAllEstadosGrupos(){
    this._config.getEstadosGrupo().subscribe({
      next:(value) => {
        if(value.ok){
          this.listEstadosGrupo = value.data as Array<EstadoGrupo>;
        }
      },
      error:(e) => {
        console.log(e)
        this.messageError(e)
      }
    })
  }

  getAllCategoriasPago(){
    this._config.getCategoriasPago().subscribe({
      next:(value) => {
        if(value.ok){
          this.listCategoriaspago = value.data as Array<CategoriaPago>;
        }
      },
      error:(e) => {
        console.log(e)
        this.messageError(e)
      }
    })
  }

  getAllTiposTramite(){
    this._config.getTiposTramite().subscribe({
      next:(value) => {
        if(value.ok){
          this.listTiposTramite = value.data as Array<TipoTramite>;
        }
      },
      error:(e) => {
        console.log(e)
        this.messageError(e)
      }
    })
  }

  getAllMediosPago(){
    this._config.getMediosPago().subscribe({
      next:(value) => {
        if(value.ok){
          this.listMediosPago = value.data as Array<MedioPago>;
        }
      },
      error:(e) => {
        console.log(e)
        this.messageError(e)
      }
    })
  }

  getAllDenominServicio(){
    this._config.getDenominServicio().subscribe({
      next:(value) => {
        if(value.ok){
          this.listDenominacionServicios = value.data as Array<DenominServicio>;
        }
      },
      error:(e) => {
        console.log(e)
        this.messageError(e)
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

  toast(severity:string, summary:string, detail?:string, key?:string){
    this._msg.add({severity, summary, detail, key});
  }


}
