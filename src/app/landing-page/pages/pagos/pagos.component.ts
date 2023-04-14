import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

interface Card {
  name: string,
  code: string
}

@Component({
  selector: 'app-pagos',
  templateUrl: './pagos.component.html',
  styleUrls: ['./pagos.component.scss']
})
export class PagosComponent {

  /** Variables de clase */
  card:Card[];
  TipoDocumentoSelected:string;
  formBusqueda:FormGroup;
  loading:boolean;

  constructor(private readonly fb:FormBuilder) {
    this.createFormulario();
    this.inicializateVariables();
  }

  inicializateVariables(){
    this.card = [];
    this.card = [ { name: 'DNI', code: 'DNI'}, { name: 'Carnet de extranjería', code: 'CDE' }]
    this.TipoDocumentoSelected = 'DNI';
    this.loading = false;
  }

  createFormulario(){
    this.formBusqueda = this.fb.group({
      TipoDocumento:['DNI', Validators.required ],
      Documento:[null, [Validators.required, Validators.pattern(/^([0-9])*$/)]]
    })
  }

  /** getters */
  get TipoDocumento(){
    return this.formBusqueda.controls['TipoDocumento']
  }
  get Documento(){
    return this.formBusqueda.controls['Documento']
  }

  changeCard(event:Event){
    this.TipoDocumentoSelected = this.TipoDocumento.value;
    console.log(this.TipoDocumentoSelected)
  }

  search(){

    if(this.formBusqueda.invalid){
      Object.keys(this.formBusqueda.controls).forEach( input => this.formBusqueda.controls[ input ].markAsDirty() )
      return;
    }

    console.log(this.formBusqueda.value)
  }

}
