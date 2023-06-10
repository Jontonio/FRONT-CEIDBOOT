import { Component, OnInit, Input } from '@angular/core';
import { Pago } from '../../class/Pago';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GrupoService } from '../../services/grupo.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MessageService } from 'primeng/api';

import * as moment from 'moment';
import { SocketService } from 'src/app/services/socket.service';
import { PayloadSocket } from 'src/app/class/PayloadSocket';
import { MedioPago } from 'src/app/class/MedioDePago';
import { GlobalService } from 'src/app/services/global.service';
import { GrupoModulo } from '../../class/GrupoModulo';
moment.locale("es");

@Component({
  selector: 'app-modal-mensualidad',
  templateUrl: './modal-mensualidad.component.html',
  styleUrls: ['./modal-mensualidad.component.scss']
})
export class ModalMensualidadComponent implements OnInit {

  @Input() nameEventUpdate:string;

  listMedioPago:MedioPago[] = [];
  listModulosPago:GrupoModulo[] = [];
  ValidateFile:boolean = false;
  loading:boolean = false;
  formMensualidad:FormGroup;
  selectGrupoModulo:GrupoModulo | undefined;
  mensualidad:Pago;
  payload:PayloadSocket;

  constructor(private readonly spinner:NgxSpinnerService,
              private readonly _socketService:SocketService,
              private readonly _grupo:GrupoService,
              private readonly _global:GlobalService,
              private readonly fb:FormBuilder,
              private _msg:MessageService) {
    this.createFormMensualidad();
  }

  ngOnInit(): void {
    this.getMediosPagos();
  }

  createFormMensualidad(){
    this.formMensualidad = this.fb.group({
      Id:[null, Validators.required],
      FechaPago:[null, [Validators.required, Validators.pattern(/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[012])\/\d{4}$/)]],
      CodigoVoucher:[null, [Validators.required, Validators.pattern(/^([0-9])*$/)]],
      MontoPago:[null, [ Validators.required, Validators.pattern(/^([0-9])*$/)]],
      MedioDePago:[null, Validators.required],
      Verificado:[null, Validators.required],
      grupoModulo:[null]
    })
  }

  get Id(){
    return this.formMensualidad.controls['Id'];
  }
  get FechaPago(){
    return this.formMensualidad.controls['FechaPago'];
  }
  get CodigoVoucher(){
    return this.formMensualidad.controls['CodigoVoucher'];
  }
  get MontoPago(){
    return this.formMensualidad.controls['MontoPago'];
  }
  get Verificado(){
    return this.formMensualidad.controls['Verificado'];
  }
  get MedioDePago(){
    return this.formMensualidad.controls['MedioDePago'];
  }
  get grupoModulo(){
    return this.formMensualidad.controls['grupoModulo'];
  }

  openModal(mensualidad:Pago, payload?:PayloadSocket, grupoModulos:GrupoModulo[] = []){
    this.payload = payload!;
    this.spinner.show();
    this.ValidateFile = true;
    this.mensualidad = mensualidad;
    this.listModulosPago = grupoModulos!;
    this.completeValues(this.mensualidad);
  }

  getMediosPagos() {
    this._global.getMediosDePago().subscribe({
      next:(res) => {
        if(res.ok){
          this.listMedioPago = res.data as Array<MedioPago>;
        }
      },
      error:(e) => {
        console.log(e)
      }
    })
  }

  closeModal(){
    this.ValidateFile = false;
  }

  save(){
    /** Set Id on formulario mensualidad */
    this.Id.setValue(this.mensualidad.Id);

    if(this.formMensualidad.invalid){
      Object.keys( this.formMensualidad.controls )
            .forEach( input => this.formMensualidad.controls[ input ].markAsDirty());
      return;
    }

    /** Parse fecha pago to Date */
    const fechaPago = moment(this.FechaPago.value,'DD/MM/YYYY').toDate();
    const data = {
      FechaPago:fechaPago,
      CodigoVoucher: this.CodigoVoucher.value,
      Verificado: this.Verificado.value,
      MontoPago:this.MontoPago.value,
      medioDePago: this.MedioDePago.value,
      grupoModulo: this.grupoModulo.value
    };
    this.loading = true;
    this._grupo.updatePago( this.Id.value, data as Pago).subscribe({
      next: ( value ) => {
        setTimeout(() => {
          this.loading = false;
          if(value.ok){
            this.toast('success',value.msg);
            this.reset();
            this.closeModal();
            this._socketService.EmitEvent(this.nameEventUpdate, this.payload );
            return;
          }
          this.toast('warn',value.msg);
        }, 100);
      },
      error: (e) => {
        console.log(e)
        this.loading = false;
        this.messageError(e);
      }
    })
  }

  completeValues(pago:Pago){
    if(pago.FechaPago){
      const fechaPago = moment(pago.FechaPago,'YYYY-MM-DD');
      const newFechaPago = fechaPago.format('DD/MM/YYYY');
      this.FechaPago.setValue(newFechaPago);
    }
    this.CodigoVoucher.setValue(pago.CodigoVoucher);
    this.MontoPago.setValue(pago.MontoPago);
    this.Verificado.setValue(pago.Verificado);
    this.MedioDePago.setValue(pago.medioDePago);
    this.selectGrupoModulo = pago.grupoModulo;
    this.grupoModulo.setValue(pago.grupoModulo);
  }

  reset(){
    this.ValidateFile = false;
    this.formMensualidad.reset();
  }

  selectedModuloGrupo(grupoModulo:GrupoModulo){
    this.selectGrupoModulo = grupoModulo;
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

}
