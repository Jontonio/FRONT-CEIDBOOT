import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Grupo } from 'src/app/main/grupo/class/Grupo';
import { GrupoService } from 'src/app/main/grupo/services/grupo.service';
import { Subscription } from 'rxjs';
import { UnAuthorizedService } from 'src/app/services/unauthorized.service';
import { HttpErrorResponse } from '@angular/common/http';
import { EstadoGrupo } from '../../class/EstadoGrupo';
import { SocketService } from 'src/app/services/socket.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-ver-grupo',
  templateUrl: './ver-grupo.component.html',
  styleUrls: ['./ver-grupo.component.scss']
})
export class VerGrupoComponent implements OnInit {

  /** Subscription variables */
  grupo$:Subscription;

  /** Variables de clase */
  grupo:Grupo;
  listEstadoGrupo:EstadoGrupo[];
  estadoGrupo:EstadoGrupo;
  urlLista:string;
  loadingSave:boolean = false;
  IdGrupo:number | undefined;
  saveLoading:boolean = false;

  /** Formulario pago */
  formRecodatorioPago:FormGroup;

  constructor(private routerActive:ActivatedRoute,
              private readonly fb:FormBuilder,
              private readonly _grupo:GrupoService,
              private readonly _unAuth:UnAuthorizedService,
              private readonly _socket:SocketService,
              private route:Router,
              private _msg:MessageService) {
    this.createFormRecordatorioPago();
    this.getIdParams(this.routerActive);
  }

  ngOnInit(): void {
    this.urlLista = '/system/grupos/lista-grupos';
  }

  ngOnDestroy(): void {
    if(this.grupo$) this.grupo$.unsubscribe();
  }

  getIdParams(routerActive:ActivatedRoute){
    const { id } = routerActive.snapshot.params;
    if(!id){
      this.toast('error','El Id del grupo es necesario para continuar con la operación')
      return;
    }
    this.IdGrupo = id;
    this.grupo$ = this._grupo.getOneGrupo(id).subscribe({
      next: (value) => {
        if(!value.ok) return;
        this.grupo = value.data as Grupo;
        this.completeDataFormRecordatorioPago(this.grupo);
        this.getEstadosGrupo();
      },
      error: (e) =>{
        this.messageError(e);
        this._unAuth.unAuthResponse(e);
        this.route.navigate([this.urlLista]);
      }
    })
  }

  getEstadosGrupo(){
    this._grupo.getAllEstadoGrupo().subscribe({
      next: (value) => {
        if(value.ok){
          this.listEstadoGrupo = value.data as Array<EstadoGrupo>;
          this.estadoGrupo = this.grupo.estadoGrupo;
          return;
        }
        this.toast('warn', value.msg);
      },
      error: (e) => {
        this.messageError(e);
      }
    })
  }

  saveEstadoGrupo(){
    if((!this.estadoGrupo) && (!this.grupo)) return;
    this.loadingSave = true;
    this._grupo.updateGrupo(this.grupo.Id, { estadoGrupo:{ Id:this.estadoGrupo.Id } }as Grupo)
    .subscribe({
      next: (value) => {
            this.loadingSave = false;
            if(value.ok){
              this.toast('success', value.msg);
              this._socket.EmitEvent('updated_list_grupo');
              return;
            }
            this.toast('warn', value.msg);
          },
      error: (e) => {
        this.loadingSave = false;
        this.messageError(e);
      }
    })
  }

  createFormRecordatorioPago(){
    this.formRecodatorioPago = this.fb.group({
      AplicaMora:[null],
      MontoMora: [null, Validators.required],
      NotificarGrupo: [null],
      NumDiasHolaguraMora: [null, Validators.required]
    })
  }

  get AplicaMora(){
    return this.formRecodatorioPago.controls['AplicaMora'];
  }
  get MontoMora(){
    return this.formRecodatorioPago.controls['MontoMora'];
  }
  get NotificarGrupo(){
    return this.formRecodatorioPago.controls['NotificarGrupo'];
  }
  get NumDiasHolaguraMora(){
    return this.formRecodatorioPago.controls['NumDiasHolaguraMora'];
  }

  messageError(e:HttpErrorResponse){
    if(e.status==401) return;
    const msg = e.error.message;
    Array.isArray(msg)?msg.forEach((e) => this.toast('error',e,'Error de validación de datos')):
                                                  this.toast('error',msg,`${e.error.error}:${e.error.statusCode}`)
  }

  toast(type:string, msg:string, detail:string=''){
    this._msg.add({severity:type, summary:msg, detail});
  }

  completeDataFormRecordatorioPago(grupo:Grupo){
    this.AplicaMora.setValue(grupo.AplicaMora)
    this.MontoMora.setValue(grupo.MontoMora)
    this.NotificarGrupo.setValue(grupo.NotificarGrupo)
    this.NumDiasHolaguraMora.setValue(grupo.NumDiasHolaguraMora)
  }

  save(){

    if(this.formRecodatorioPago.invalid){
      Object.keys( this.formRecodatorioPago.controls ).forEach( label => this.formRecodatorioPago.controls[label].markAsDirty() )
      return;
    }

    this.saveLoading = true;
    this._grupo.updateGrupo(this.IdGrupo!, this.formRecodatorioPago.value as Grupo).subscribe({
      next: (value) => {
        this.saveLoading = false;
        if(value.ok){
          this.toast('success', value.msg);
          return;
        }
        this.toast('warn',value.msg)
      },
      error: (e) => {
        console.log(e)
        this.saveLoading = false;
        this.messageError(e);
      }
    })
  }

}
