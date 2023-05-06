import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RequestDocumento } from 'src/app/main/matricula/class/Estudiante';
import { GlobalService } from 'src/app/services/global.service';

interface Card {
  name: string,
  code: string
}

@Component({
  selector: 'app-form-select-info-personal',
  templateUrl: './form-select-info-personal.component.html',
  styleUrls: ['./form-select-info-personal.component.scss']
})
export class FormSelectInfoPersonalComponent implements OnInit {

  @Output() dataDocumento = new EventEmitter<RequestDocumento>();
  @Input()  formDocumento:FormGroup;

  card:Card[] = [];
  TipoDocumentoSelected:string;
  loadGetData:boolean;

  constructor() {}

  ngOnInit(): void {
    this.card = [
      {name: 'DNI', code: 'DNI'},
      {name: 'Carnet de extranjería', code: 'CDE' }
    ];
    this.loadGetData = false;
  }

  changeCard(event:string){
    this.TipoDocumentoSelected = this.TipoDocumento.value;
  }

  get TipoDocumento(){
    return this.formDocumento.controls['TipoDocumento'];
  }
  get Documento(){
    return this.formDocumento.controls['Documento'];
  }

  searchEstudiante(documento:string=''){
    /** verificar si el documento no este vacia*/
    if(!documento) return;
    /** validar para hacer la busqueda del documento*/
    if(this.TipoDocumento.value == 'DNI' && this.Documento.valid && documento.length==8){
      this.dataDocumento.emit({Documento:this.Documento.value, TipoDocumento: this.TipoDocumento.value})
    }
    if(this.TipoDocumento.value == 'CDE' && this.Documento.valid && documento.length==12){
      this.dataDocumento.emit({Documento:this.Documento.value, TipoDocumento: this.TipoDocumento.value})
    }
  }


}
