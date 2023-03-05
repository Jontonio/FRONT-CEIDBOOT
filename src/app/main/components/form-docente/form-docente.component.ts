import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Person } from 'src/app/class/Person';
import { GlobalService } from 'src/app/services/global.service';
import { Code } from '../../class/Code';
import { Docente } from '../../class/Docente';
import { MainService } from '../../services/main.service';

interface Card {
  name: string,
  code: string
}

@Component({
  selector: 'app-form-docente',
  templateUrl: './form-docente.component.html',
  styleUrls: ['./form-docente.component.scss']
})
export class FormDocenteComponent implements OnInit {

  @Output() dataForm = new EventEmitter<Docente>();
  @Input() loadding:boolean;

  formDocente     :FormGroup;
  card            :Card[] = [];
  TipoDocumentoSelected:string = 'DNI';
  loadGetData:boolean = false;
  country:Code;

  constructor(private fb:FormBuilder,
              public _main:MainService,
              private _global:GlobalService,
              private _msg:MessageService) {

                this.createdForm();

              }

  ngOnInit(): void {

    this.country = { name:'Peru', codePhone:'+51', flag:'https://flagcdn.com/pe.svg', code:'PE'};

    this.card = [
      {name: 'DNI', code: 'DNI'},
      {name: 'Carnet de extranjería', code: 'CDE' }
    ];

  }

  createdForm(){

    this.formDocente = this.fb.group({
      // IdDocente:[null, [Validators.pattern(/^([0-9])*$/)]],
      TipoDocumento:['DNI', Validators.required],
      Documento:[null, [Validators.required,Validators.pattern(/^([0-9])*$/)]],
      Nombres:[null, [Validators.required,Validators.pattern(/^([a-z ñáéíóú]{2,60})$/i)]],
      ApellidoPaterno:[null, [Validators.required,Validators.pattern(/^([a-z ñáéíóú]{1,60})$/i)]],
      ApellidoMaterno:[null, [Validators.required,Validators.pattern(/^([a-z ñáéíóú]{1,60})$/i)]],
      Direccion:[null, Validators.required],
      Celular:[null, [Validators.pattern(/^([0-9])*$/), Validators.required]],
      Email:[null, [Validators.required,Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
    });

  }

  get Documento(){
    return this.formDocente.controls['Documento'];
  }
  get Nombres(){
    return this.formDocente.controls['Nombres'];
  }
  get ApellidoPaterno(){
    return this.formDocente.controls['ApellidoPaterno'];
  }
  get ApellidoMaterno(){
    return this.formDocente.controls['ApellidoMaterno'];
  }
  get Direccion(){
    return this.formDocente.controls['Direccion'];
  }
  get Celular(){
    return this.formDocente.controls['Celular'];
  }
  get Email(){
    return this.formDocente.controls['Email'];
  }
  get TipoDocumento(){
    return this.formDocente.controls['TipoDocumento'];
  }

  ready(){

    if(this.formDocente.invalid){
      Object.keys(this.formDocente.controls).forEach( input => {
        this.formDocente.controls[input].markAsDirty();
      });
      return;
    }

    console.log(this.formDocente.value);
    console.log(this.country)

    const docente = new Docente(this.TipoDocumento.value,
                                this.Documento.value,
                                this.Nombres.value,
                                this.ApellidoMaterno.value,
                                this.ApellidoPaterno.value,
                                this.Celular.value,
                                this.Email.value,
                                this.Direccion.value,
                                this.country.code,
                                this.country.codePhone);
    this.dataForm.emit(docente);
  }

  reset(){
    this.formDocente.reset();
    this.TipoDocumentoSelected = 'DNI';
  }

  changeCard(event:string){
    this.TipoDocumentoSelected = this.TipoDocumento.value;
  }

  Reniec(documento:string=''){

    if(!documento) return;

    if(documento.length==8 && this.TipoDocumento.value=='DNI' && this.Documento.valid ){

      this.loadGetData = true;
      this._global.apiReniec(documento).subscribe({
        next: (value) => {
          if(value.ok){
            console.log(value);
            this.completeData(value.data);
            this.toast('success',value.msg,'Datos consultados a RENIEC')
          }else{
            console.log(value.msg);
            this.toast('warn',value.msg,'Datos consultados a RENIEC')
          }
          this.loadGetData = false;
        },
        error: (err) => {
          this.loadGetData = false;
          console.log(err);
        }
      })
    }
  }

  selectedCountry(country:Code){
    this.country = country;
  }

  completeData(person:Person){
    this.Nombres.setValue(person.nombres);
    this.ApellidoPaterno.setValue(person.apellidoPaterno);
    this.ApellidoMaterno.setValue(person.apellidoMaterno);
  }

  toast(type:string, msg:string, detail:string=''){
    this._msg.add({severity:type, summary:msg, detail});
  }

}
