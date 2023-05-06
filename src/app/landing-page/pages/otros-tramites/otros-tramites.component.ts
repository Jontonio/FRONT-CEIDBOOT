import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { MessageService } from 'primeng/api';
import { TipoTramite } from 'src/app/main/class/TipoTramite';
import { Curso } from 'src/app/main/curso/class/Curso';
import { Estudiante, RequestDocumento } from 'src/app/main/matricula/class/Estudiante';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-otros-tramites',
  templateUrl: './otros-tramites.component.html',
  styleUrls: ['./otros-tramites.component.scss']
})
export class OtrosTramitesComponent implements OnInit {

  @ViewChild('stepper') stepper:MatStepper;

  formTramite   :FormGroup;
  formEstudiante:FormGroup;
  formCurso     :FormGroup;
  formFiles     :FormGroup;
  formDocumento :FormGroup;

  hayError:boolean;
  loadingGetData:boolean;
  existsEstudiante:boolean;
  loadingDocumento:boolean;
  loadingDocumentoExtra:boolean;
  loadingFilePago:boolean;
  needSelectCurso:boolean;
  needOtherfileUpload:boolean;

  selectTipoTramite:TipoTramite;
  estudiante:Estudiante;
  montoPago:number = 0;

  constructor( private fb:FormBuilder,
               private readonly _global:GlobalService,
               private _msg:MessageService ) {
    this.createFormTramite();
    this.createFormEstudiante();
    this.createFormCurso();
    this.createFormFiles();
    this.createFormDocumento();
  }

  ngOnInit(): void {
    this.hayError              = false;
    this.loadingGetData        = false;
    this.existsEstudiante      = false;
    this.loadingDocumento      = false;
    this.loadingDocumentoExtra = false;
    this.loadingFilePago       = false;
    this.needSelectCurso       = false;
    this.needOtherfileUpload   = false;
  }

  createFormTramite(){
    this.formTramite = this.fb.group({ TipoTramite:[null, Validators.required ] })
  }

  createFormCurso(){
    this.formCurso = this.fb.group({ curso:[null, Validators.required ] })
  }

  createFormEstudiante(){
    this.formEstudiante = this.fb.group({
      TipoDocumento:['DNI', Validators.required],
      Documento:[null, [Validators.required, Validators.pattern(/^([0-9])*$/)]],
      Nombres:[null, [Validators.required,Validators.pattern(/^([a-z ñáéíóú]{2,60})$/i)]],
      ApellidoPaterno:[null, [Validators.required,Validators.pattern(/^([a-z ñáéíóú]{1,60})$/i)]],
      ApellidoMaterno:[null, [Validators.required,Validators.pattern(/^([a-z ñáéíóú]{1,60})$/i)]],
      FechaNacimiento:[null, [Validators.required]],
      Sexo:[null, [Validators.required]],
      Direccion:[null, Validators.required],
      Celular:[null, [Validators.pattern(/^([0-9])*$/), Validators.required]],
      Email:[null, [Validators.required,Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
      Departamento:[null, Validators.required],
      Provincia:[null, Validators.required],
      Distrito:[null, Validators.required]
    })
  }

  createFormFiles(){
    this.formFiles = this.fb.group({
      FileDocumento:[null, Validators.required ],
      FileDataDocumento:[null, Validators.required ],
      FileDocumentoExtra:[null, Validators.required ],
      FileDataDocumentoExtra:[null, Validators.required ],
      MontoPago:[null, Validators.required ],
      NumOperacion:[null, Validators.required ],
      FechaPago:[null, [Validators.required, Validators.pattern(/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[012])\/\d{4}$/)]],
      FilePago:[null, Validators.required ],
      FileDataPago:[null, Validators.required ],
    })
  }

  createFormDocumento(){
    this.formDocumento = this.fb.group({
      TipoDocumento:['DNI', Validators.required],
      Documento:[null, [Validators.required, Validators.pattern(/^([0-9])*$/), Validators.minLength(8)]],
      IsVerify:[null, Validators.required ]
    })
  }

  get TipoTramite(){
    return this.formTramite.controls['TipoTramite'];
  }
  get Documento(){
    return this.formEstudiante.controls['Documento'];
  }
  get IsVerify(){
    return this.formDocumento.controls['IsVerify'];
  }
  get Email(){
    return this.formEstudiante.controls['Email'];
  }

  goBack(){
    // siguiente formulario
    this.stepper.previous();
  }

  goForward(){
    // siguiente formulario
    this.stepper.next();
  }

  readyTipoTramite(){
    // Verificamos los campos del formulario
    if(this.formTramite.invalid){
      Object.keys( this.formTramite.controls ).forEach( label => this.formTramite.controls[label].markAsDirty())
      return;
    }


    this.selectTipoTramite = this.TipoTramite.value;
    //! Este comparación se da en función al id registrado en la base de datos
    this.needSelectCurso    = this.selectTipoTramite.Id === 1?true:false;
    //! Este comparación se da en función al id registrado en la base de datos
    this.needOtherfileUpload = this.selectTipoTramite.Id == 4?true:false;
    // asignamos el precio del derecho de pago
    this.montoPago = this.selectTipoTramite.DerechoPagoTramite;
    // Avanzamos al siguiente formulario
    this.goForward();
  }

  /** Valid forms */
  readyDocumento(){
    // Verificamos que dio click en el boton
    this.IsVerify.setValue(true);
    // Verificamos los campos del formulario
    if(this.formDocumento.invalid){
      Object.keys(this.formDocumento.controls).forEach( inputName => this.formDocumento.controls[inputName].markAsDirty() )
      return;
    }
    //verificar si existe el estudiante
    this.loadingGetData = true;
    this._global.getEstudiante( this.formDocumento.value ).subscribe({
      next: (value) => {
        this.loadingGetData = false;
        if(value.data){
          this.existsEstudiante = false;
          //TODO: obtener al estudiante
          this.estudiante = value.data as Estudiante;
          this.goForward();
        }else{
          this.existsEstudiante = true;
        }
      },
      error: (e) => {
        this.loadingGetData = false;
        console.log(e)
      }
    })

  }

  readyCurso(){
    // Verificamos los campos del formulario
    if(this.formCurso.invalid){
      Object.keys(this.formCurso.controls).forEach( inputName => this.formCurso.controls[inputName].markAsDirty() )
      return;
    }
    console.log("pasa")
  }

  readyEstudent(){
    // Verificamos los campos del formulario
    if(this.formEstudiante.invalid){
      Object.keys(this.formEstudiante.controls).forEach( inputName => this.formEstudiante.controls[inputName].markAsDirty() )
      return;
    }

    // Verificamos si ese email ya esta registrado con el mismo usuario
    this._global.getEmailDocEstudiante({ Documento:this.Documento.value, Email: this.Email.value })
      .subscribe({
        next: (res) => {
          if(!res.ok){
            this.toast('error', res.msg);
            this.Email.setErrors({notUnique:true});
            this.hayError = true;
            return;
          }else{
            this.hayError = false;
            this._msg.clear('message-matricula');
          }
        },
        error: (e) => this.messageError(e)
    })
    // Avanzamos al siguiente formulario
    this.goForward();
  }

  selectedCurso(curso:Curso){
    this.needSelectCurso = false;
    // asignar un nuevo monto de pago si existe un curso por elegir
    this.montoPago = curso.PrecioExamSuficiencia;
  }

  tipoTramiteSelected(tipoTramite:TipoTramite){}

  registrar(){
    // Verificamos los campos del formulario
    console.log(this.formTramite.value);
    console.log(this.formEstudiante.value);
    console.log(this.formFiles.value);
    console.log(this.estudiante)

    if(this.formFiles.invalid){
      Object.keys(this.formFiles.controls).forEach( inputName => this.formFiles.controls[inputName].markAsDirty() )
      return;
    }

  }

  dataDocumento(data:RequestDocumento){

  }

  stateLoadingDocumento(event:boolean){
    this.loadingDocumento = event;
  }

  stateLoadingDocumentoExtra(event:boolean){
    this.loadingDocumentoExtra = event;
  }

  stateLoadingFilePago(event:boolean){
    this.loadingFilePago = event;
  }

  toast(severity:string, summary:string, detail:string=''){
    this._msg.add({severity, summary, detail, key:'message-examen-suf'});
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
