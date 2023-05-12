import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Person } from 'src/app/class/Person';
import { Departamento, Distrito, Provincia } from 'src/app/main/class/Ubigeo';
import { Code } from 'src/app/main/grupo/class/Code';
import { Sexo } from 'src/app/main/matricula/interfaces/global';
import { GlobalService } from 'src/app/services/global.service';
import { Subscription } from 'rxjs';
import { MainService } from 'src/app/main/services/main.service';
import { Estudiante } from 'src/app/main/matricula/class/Estudiante';


interface Card {
  name: string,
  code: string
}

@Component({
  selector: 'app-form-info-personal',
  templateUrl: './form-info-personal.component.html',
  styleUrls: ['./form-info-personal.component.scss']
})
export class FormInfoPersonalComponent implements OnInit {
  // El componente puede retornar datos del formulario se va ser necesario
  @Output() formData = new EventEmitter<Estudiante>();
  @Input() formEstudiante:FormGroup;

  listDepartamentos$:Subscription;
  listProvincias$:Subscription;
  listDistritos$:Subscription;

  TipoDocumentoSelected:string;
  loadGetData:boolean = false;
  hayErrorGetData:boolean;
  hayError:boolean;
  isPeru:boolean;

  listDepartamentos:Departamento[];
  listProvincias:Provincia[] = [];
  listDistritos:Distrito[] = [];
  optionSexo:Sexo[];
  card:Card[] = [];
  country:Code;
  today:Date;

  constructor(private readonly _global:GlobalService,
              private readonly _main:MainService,
              private _msg:MessageService) {}

  ngOnDestroy(): void {
    if(this.listDepartamentos$) this.listDepartamentos$.unsubscribe();
    if(this.listProvincias$) this.listProvincias$.unsubscribe();
    if(this.listDistritos$) this.listDistritos$.unsubscribe();
  }

  ngOnInit(): void {

    this.getDepartamentos();
    this.inicializateCodes();

    this.today = new Date();
    this.hayErrorGetData = false;
    this.hayError = false;

    this.optionSexo = [
      { name:'Masculino', code:'masculino' },
      { name:'Femenino', code:'Femenino' },
      { name:'otros', code:'otros' },
    ];

    this.card = [
      {name: 'DNI', code: 'DNI'},
      {name: 'Carnet de extranjería', code: 'CDE' }
    ];

  }

  /** Getters */
  get TipoDocumento(){
    return this.formEstudiante.controls['TipoDocumento'];
  }
  get Documento(){
    return this.formEstudiante.controls['Documento'];
  }
  get Nombres(){
    return this.formEstudiante.controls['Nombres'];
  }
  get ApellidoPaterno(){
    return this.formEstudiante.controls['ApellidoPaterno'];
  }
  get ApellidoMaterno(){
    return this.formEstudiante.controls['ApellidoMaterno'];
  }
  get FechaNacimiento(){
    return this.formEstudiante.controls['FechaNacimiento'];
  }
  get Sexo(){
    return this.formEstudiante.controls['Sexo'];
  }
  get Direccion(){
    return this.formEstudiante.controls['Direccion'];
  }
  get Celular(){
    return this.formEstudiante.controls['Celular'];
  }
  get Code(){
    return this.formEstudiante.controls['Code'];
  }
  get CodePhone(){
    return this.formEstudiante.controls['CodePhone'];
  }
  get Email(){
    return this.formEstudiante.controls['Email'];
  }
  get departamento(){
    return this.formEstudiante.controls['departamento'];
  }
  get provincia(){
    return this.formEstudiante.controls['provincia'];
  }
  get distrito(){
    return this.formEstudiante.controls['distrito'];
  }

  changeCard(event:string){
    this.TipoDocumentoSelected = this.TipoDocumento.value;
  }

  getDepartamentos(){
    this.listDepartamentos$ =this._main.getDepartamentos().subscribe({
      next: (value) => {
        this.listDepartamentos = value;
        this.hayErrorGetData = false;
      },
      error: (e) => this.hayErrorGetData = true
    })
  }

  selectedDepartamento(departamento:Departamento){
    this.listDistritos = [];
    if(!departamento) return;
    this.listDistritos$ = this.listProvincias$ = this._main.getProvincias(departamento.IdDepartamento).subscribe({
      next: (value) => {
        this.listProvincias = value;
      },
      error: (e) => this.messageError(e)
    })
  }

  selectedProvincia(provincia:Provincia){
    if(!provincia) return;
    this._main.getDistritos(provincia.IdProvincia).subscribe({
      next: (value) => {
        this.listDistritos = value;
      },
      error: (e) => this.messageError(e)
    })
  }

  getDataReniec(documento:string, isPeru:boolean = true){
    /** verificar si el documento es de perú o del extranjero */
    if(!isPeru) return;
    this.loadGetData = true;
    /** realiza la petición de los datos mediante el enpoint */
    this._global.apiReniec(documento).subscribe({
      next: (value) => {
        this.loadGetData = false;
        if(value.ok){
          this.completeData(value.data);
          this.toast('success',value.msg,'Datos consultados a RENIEC');
          return;
        }
        this.toast('warn',value.msg,'Datos consultados a RENIEC')
      },
      error: (e) => {
        this.loadGetData = false;
        console.log(e);
      }
    })
  }

  searchEstudiante(documento:string=''){
    /** verificar si el documento no este vacia*/
    if(!documento) return;
    /** validar para hacer la busqueda del documento en RENIEC */
    (this.TipoDocumento.value=='DNI' && documento.length==8 && this.Documento.valid)?this.getDataReniec(documento, true):''
  }

  toast(severity:string, summary:string, detail:string=''){
    this._msg.add({severity, summary, detail, key:'message-matricula'});
  }

  completeData(estudiante:Person){
    this.Nombres.setValue(estudiante.nombres);
    this.ApellidoPaterno.setValue(estudiante.apellidoPaterno);
    this.ApellidoMaterno.setValue(estudiante.apellidoMaterno);
  }

  requiredCountry(){
    this.departamento.addValidators([Validators.required]);
    this.provincia.addValidators([Validators.required]);
    this.distrito.addValidators([Validators.required]);
  }

  notRequiredCountry(){
      this.departamento.clearValidators();
      this.provincia.clearValidators();
      this.distrito.clearValidators();

      this.departamento.updateValueAndValidity();
      this.provincia.updateValueAndValidity();
      this.distrito.updateValueAndValidity();

      this.departamento.markAsPristine();
      this.provincia.markAsPristine();
      this.distrito.markAsPristine();
  }

  selectedCountry(country:Code){
    this.country = country;
    this.isPeru = (this.country.code!='PE')?false:true;
    this.isPeru?this.requiredCountry():this.notRequiredCountry();
    this.Code.setValue( this.country.code );
    this.CodePhone.setValue( this.country.codePhone );
  }

  inicializateCodes(){
    this.country = { name:'Peru', codePhone:'+51', flag:'https://flagcdn.com/pe.svg', code:'PE'};
    this.isPeru = true;
    this.Code.setValue( this.country.code );
    this.CodePhone.setValue( this.country.codePhone );
  }

  messageError(e:any, detail:string = 'Error de validación de datos'){
    if(Array.isArray(e.error.message)){
      e.error.message.forEach( (e:string) => {
        this.toast('error', e, detail)
      })
    }else{
      console.log()
      this.toast('error',e.error.message, detail);
    }
  }

}
