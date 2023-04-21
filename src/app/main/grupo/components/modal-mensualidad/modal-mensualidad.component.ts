import { Component, OnInit, Input } from '@angular/core';
import { Pago } from '../../class/Pago';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GrupoService } from '../../services/grupo.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MessageService } from 'primeng/api';

import * as moment from 'moment';
moment.locale("es");

@Component({
  selector: 'app-modal-mensualidad',
  templateUrl: './modal-mensualidad.component.html',
  styleUrls: ['./modal-mensualidad.component.scss']
})
export class ModalMensualidadComponent implements OnInit {

  ValidateFile:boolean = false;
  mensualidad:Pago;
  formMensualidad:FormGroup;
  loading:boolean = false;

  constructor(private readonly spinner: NgxSpinnerService,
              private readonly _grupo:GrupoService,
              private _msg:MessageService,
              private readonly fb: FormBuilder) {
    this.createFormMensualidad();
  }

  ngOnInit(): void {
  }

  createFormMensualidad(){
    this.formMensualidad = this.fb.group({
      Id:[null, Validators.required],
      FechaPago:[null, [Validators.required, Validators.pattern(/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[012])\/\d{4}$/)]],
      CodigoVoucher:[null, [Validators.required, Validators.pattern(/^([0-9])*$/)]],
      Verificado:[null, Validators.required]
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
  get Verificado(){
    return this.formMensualidad.controls['Verificado'];
  }

  openModal(mensualidad:Pago){
    this.spinner.show();
    this.ValidateFile = true;
    this.mensualidad = mensualidad;
    this.completeValues(this.mensualidad);
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
    const data = { FechaPago:fechaPago, CodigoVoucher: this.CodigoVoucher.value, Verificado: this.Verificado.value };

    this.loading = true;

    this._grupo.updatePago( this.Id.value, data as Pago).subscribe({
      next: ( value ) => {
        setTimeout(() => {
          this.loading = false;
          if(value.ok){
            this.toast('success',value.msg);
            this.reset();
            this.closeModal();
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

  completeValues(mensualidad:Pago){
    if(mensualidad.FechaPago){
      const fechaPago = moment(mensualidad.FechaPago,'YYYY-MM-DD');
      const newFechaPAgo = fechaPago.format('DD/MM/YYYY');
      this.FechaPago.setValue(newFechaPAgo);
    }
    this.CodigoVoucher.setValue(mensualidad.CodigoVoucher);
    this.Verificado.setValue(mensualidad.Verificado);
  }

  reset(){
    this.ValidateFile = false;
    this.formMensualidad.reset();
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
