import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges} from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { GrupoModulo } from '../../class/GrupoModulo';
import { EstudianteEnGrupo } from '../../class/EstudianteGrupo';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { GrupoService } from '../../services/grupo.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { Mora } from '../../class/Mora';

@Component({
  selector: 'app-modal-pago-extemporaneo',
  templateUrl: './modal-pago-extemporaneo.component.html',
  styleUrls: ['./modal-pago-extemporaneo.component.scss']
})
export class ModalPagoExtemporaneoComponent implements OnInit {

  listGrupoModulo:GrupoModulo[] = [];
  estudianteEnGrupo:EstudianteEnGrupo;

  formMora:UntypedFormGroup;
  selecGrupoModulo:GrupoModulo;
  loadingSave:boolean = false;

  constructor(private readonly fb:UntypedFormBuilder,
              private readonly ref: DynamicDialogRef,
              private readonly config: DynamicDialogConfig,
              private readonly _msg:MessageService,
              private readonly _grupo:GrupoService) {
    this.createFormMora();
  }

  ngOnInit(): void {
    this.listGrupoModulo = this.config.data.grupoModulo;
    this.estudianteEnGrupo = this.config.data.estudianteEnGrupo;
  }

  createFormMora(){
    this.formMora = this.fb.group({
      MontoPago:[5, Validators.required ],
      grupoModulo:[null, Validators.required]
    })
  }

  // getters
  get MontoPago(){
    return this.formMora.controls['MontoPago'];
  }

  get grupoModulo(){
    return this.formMora.controls['grupoModulo'];
  }

  selectGrupoModulo(grupoModulo:GrupoModulo){
    this.selecGrupoModulo = grupoModulo;
  }

  guardar(){
    if(this.formMora.invalid){
      Object.keys( this.formMora.controls ).forEach( label => this.formMora.controls[ label ].markAsDirty())
      return;
    }
    this.loadingSave = false;
    const mora = new Mora(this.MontoPago.value,
                          { Id: this.selecGrupoModulo.Id } as GrupoModulo,
                          { Id: this.estudianteEnGrupo.Id } as EstudianteEnGrupo);
    this._grupo.registerMora(mora).subscribe({
      next:(resp) => {
        this.loadingSave = false;
        if(resp.ok){
          this.ref.close('cerrar');
          this.toast('success', resp.msg);
          return;
        }
        this.toast('warn', resp.msg);
      },
      error:(e) => {
        this.loadingSave = false;
        console.log(e)
      }
    })
  }

  messageError(e:HttpErrorResponse){
    if(e.status==401) return;
    const msg = e.error.message;
    Array.isArray(msg)?msg.forEach((e) => this.toast('error',e,'Error de validación de datos')):
                                          this.toast('error',msg,`${e.error.error}:${e.error.statusCode}`)
  }

  toast(type:string, msg:string, detail?:string){
    this._msg.add({severity:type, summary:msg, detail});
  }
}
