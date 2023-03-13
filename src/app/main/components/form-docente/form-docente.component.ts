import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Person } from 'src/app/class/Person';
import { GlobalService } from 'src/app/services/global.service';
import { Code } from '../../class/Code';
import { Docente } from '../../class/Docente';
import { optionOperation } from '../../class/global';
import { DocenteService } from '../../services/docente.service';
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

  @Output() dataForm = new EventEmitter<optionOperation>();
  @Input() loadding:boolean;

  formDocente     :FormGroup;
  card            :Card[] = [];
  TipoDocumentoSelected:string = 'DNI';
  loadGetData:boolean = false;
  country:Code;
  isUpdate:boolean = false;
  Id?:number;

  urlLista:string = '/system/docentes/lista-docentes';

  constructor(private fb:FormBuilder,
              public _main:MainService,
              private _global:GlobalService,
              private _msg:MessageService,
              private _docente:DocenteService,
              private activeRouter:ActivatedRoute,
              private router:Router) {
                this.createdForm();
              }

  ngOnInit(): void {

    this.inicializateCodes();

    this.card = [
      {name: 'DNI', code: 'DNI'},
      {name: 'Carnet de extranjería', code: 'CDE' }
    ];

    this.getIdByUdate(this.activeRouter);
  }

  createdForm(){
    this.formDocente = this.fb.group({
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

  /** Getters */
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

    this.dataForm.emit({data:docente, option: this.isUpdate, Id:this.Id });
  }

  returnLista(){
    this.router.navigate([this.urlLista]);
  }

  resetForm(){
    this.router.navigate([this.urlLista]);
    this.TipoDocumentoSelected = 'DNI';
    this.inicializateCodes();
  }

  inicializateCodes(){
    this.country = { name:'Peru', codePhone:'+51', flag:'https://flagcdn.com/pe.svg', code:'PE'};
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

  /** Get id for edit */
  getIdByUdate(actiRouter:ActivatedRoute){
    const { id } = actiRouter.snapshot.params;
    if(!id) return;
    this.Id = id;
    this.isUpdate = true;
    this._docente.getOneDocenteById(id).subscribe({
      next: (resp) => {
        console.log(resp);
        this.completeDataUpdate(resp.data as Docente);
      },
      error: (e) => {
        console.log(e);
        this.router.navigate([this.urlLista]);
        this.messageError(e);
      }
    })
  }

  completeDataUpdate(docente:Docente){
    this.Documento.setValue(docente.Documento);
    this.TipoDocumento.setValue(docente.TipoDocumento);
    this.Nombres.setValue(docente.Nombres);
    this.ApellidoPaterno.setValue(docente.ApellidoPaterno);
    this.ApellidoMaterno.setValue(docente.ApellidoMaterno);
    this.Direccion.setValue(docente.Direccion);
    this.Email.setValue(docente.Email);
    this.Celular.setValue(docente.Celular);
    this.getOneCountryCode(docente.Code);
  }

  getOneCountryCode(code:string){
    this._main.getOneCountryByCode(code).subscribe({
      next: (resp) => {
        if(resp.length!=0){
          this.country = resp[0];
        }
      },
      error:(e) => console.log(e)
    })
  }

  messageError(e:any){
    if(Array.isArray(e.error.message)){
      e.error.message.forEach( (e:string) => {
        this.toast('error',e,'Error de validación de datos')
      })
    }else{
      this.toast('error',e.error.message,`${e.error.error}:${e.error.statusCode}`)
    }
  }

}
