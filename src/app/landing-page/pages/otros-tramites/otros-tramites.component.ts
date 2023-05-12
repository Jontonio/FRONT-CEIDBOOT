import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { MessageService } from 'primeng/api';
import { Person } from 'src/app/class/Person';
import { Tramite } from 'src/app/class/Tramite';
import { TipoTramite } from 'src/app/main/class/TipoTramite';
import { Curso } from 'src/app/main/curso/class/Curso';
import { Docente } from 'src/app/main/docente/class/Docente';
import { Pago } from 'src/app/main/grupo/class/Pago';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-otros-tramites',
  templateUrl: './otros-tramites.component.html',
  styleUrls: ['./otros-tramites.component.scss'],
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
  loadingSave:boolean;
  existsEstudiante:boolean;
  loadingDocumento:boolean;
  loadingDocumentoExtra:boolean;
  loadingFilePago:boolean;
  needSelectCurso:boolean;
  needOtherfileUpload:boolean;

  selectTipoTramite:TipoTramite;
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
    this.loadingSave           = false;
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
      Code:[null, Validators.required],
      CodePhone:[null, Validators.required],
      Email:[null, [Validators.required,Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
      departamento:[null, Validators.required],
      provincia:[null, Validators.required],
      distrito:[null, Validators.required]
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
      MedioDePago:[null, Validators.required]
    })
  }

  createFormDocumento(){
    this.formDocumento = this.fb.group({
      TipoDocumento:['DNI', Validators.required],
      Documento:[null, [Validators.required, Validators.pattern(/^([0-9])*$/), Validators.minLength(8)]],
      IsVerify:[null, Validators.required ]
    })
  }

  //form files
  get FileDocumento(){
    return this.formFiles.controls['FileDocumento'];
  }
  get FileDataDocumento(){
    return this.formFiles.controls['FileDataDocumento'];
  }
  get FileDocumentoExtra(){
    return this.formFiles.controls['FileDocumentoExtra'];
  }
  get FileDataDocumentoExtra(){
    return this.formFiles.controls['FileDataDocumentoExtra'];
  }
  get MontoPago(){
    return this.formFiles.controls['MontoPago'];
  }
  get NumOperacion(){
    return this.formFiles.controls['NumOperacion'];
  }
  get FechaPago(){
    return this.formFiles.controls['FechaPago'];
  }
  get FilePago(){
    return this.formFiles.controls['FilePago'];
  }
  get FileDataPago(){
    return this.formFiles.controls['FileDataPago'];
  }
  get MedioDePago(){
    return this.formFiles.controls['MedioDePago'];
  }

  get curso(){
    return this.formCurso.controls['curso'];
  }

  get TipoTramite(){
    return this.formTramite.controls['TipoTramite'];
  }
  get TipoDocumento(){
    return this.formEstudiante.controls['TipoDocumento'];
  }
  get TipoDocumentoTramite(){
    return this.formDocumento.controls['TipoDocumento'];
  }
  get Documento(){
    return this.formEstudiante.controls['Documento'];
  }
  get Nombres(){
    return this.formEstudiante.controls['Nombres'];
  }
  get ApellidPaterno(){
    return this.formEstudiante.controls['ApellidoPaterno'];
  }
  get ApellidoMaterno(){
    return this.formEstudiante.controls['ApellidoMaterno'];
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
    this.selectTipoTramite.Id === 1?this.addValidatorsCurso():this.clearValidatorsCurso();
    //! Este comparación se da en función al id registrado en la base de datos
    this.needOtherfileUpload = this.selectTipoTramite.Id == 4?true:false;
    this.selectTipoTramite.Id == 4?this.addValidatorsFileDocumentoExtra():this.clearValidatorsFileDocumentoExtra();
    // asignamos el precio del derecho de pago
    this.montoPago = this.selectTipoTramite.DerechoPagoTramite;
    // Avanzamos al siguiente formulario
    this.goForward();
  }

  clearValidatorsCurso(){
    this.curso.clearValidators();
    this.curso.updateValueAndValidity();
    this.curso.markAsPristine();
  }
  clearValidatorsFileDocumentoExtra(){
    this.FileDataDocumentoExtra.clearValidators();
    this.FileDataDocumentoExtra.updateValueAndValidity();
    this.FileDataDocumentoExtra.markAsPristine();
    this.FileDocumentoExtra.clearValidators();
    this.FileDocumentoExtra.updateValueAndValidity();
    this.FileDocumentoExtra.markAsPristine();
  }
  addValidatorsFileDocumentoExtra(){
    this.FileDataDocumentoExtra.addValidators([Validators.required]);
    this.FileDocumentoExtra.addValidators([Validators.required]);
  }
  addValidatorsCurso(){
    this.curso.addValidators([Validators.required]);
  }

  /** Valid forms */
  readyDocumento(){
    // Verificamos que dio click en el boton
    this.IsVerify.setValue(true);
    // Verificamos los campos del formulario
    if(this.formDocumento.invalid){
      Object.keys(this.formDocumento.controls)
            .forEach( inputName => this.formDocumento.controls[inputName].markAsDirty() )
      return;
    }
    //verificar si existe el estudiante
    this.loadingGetData = true;
    const dataQuery = this.formDocumento.value;
    this._global.getEstudiante( dataQuery ).subscribe({
      next: (value) => {
        this.loadingGetData = false;
        this._msg.clear();
        if(value.data){
          this.existsEstudiante = false;
          this.formEstudiante.patchValue(value.data);
          this.toast('success',`👋 Estudiante ${this.Nombres.value} estás en la sección donde podrás adjuntar tus archivos.`, 'otros-tramites')
          this.goForward();
        }else{
          this.toast('success',`👋 Estudiante completa el siguiente formulario para continuar con la siguiente sección del trámite`, 'otros-tramites')
          this.existsEstudiante = true;
          this.getDataReniec( dataQuery.Documento, true);
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
      Object.keys(this.formCurso.controls)
            .forEach( inputName => this.formCurso.controls[inputName].markAsDirty() )
      return;
    }
  }

  readyEstudent(){
    // Verificamos los campos del formulario
    if(this.formEstudiante.invalid){
      Object.keys(this.formEstudiante.controls)
            .forEach( inputName => this.formEstudiante.controls[inputName].markAsDirty() )
      return;
    }

    // Verificamos si ese email ya esta registrado con el mismo usuario
    this._global.getEmailDocEstudiante({ Documento:this.Documento.value, Email: this.Email.value })
      .subscribe({
        next: (res) => {
          if(!res.ok){
            this.toast('error', res.msg, 'otros-tramites');
            this.Email.setErrors({notUnique:true});
            this.hayError = true;
            return;
          }else{
            this.hayError = false;
            this._msg.clear('otros-tramites');
          }
        },
        error: (e) => this.messageError(e)
    })
    // Avanzamos al siguiente formulario
    this.goForward();
  }

  selectedCurso({ PrecioExamSuficiencia, NombreCurso, nivel }:Curso){
    this._msg.clear();
    this.needSelectCurso = false;
    // asignar un nuevo monto de pago si existe un curso por elegir
    this.montoPago = PrecioExamSuficiencia;
    this.toast('info',`Se ha selecionado el curso ${NombreCurso} ${nivel.Nivel}`,'otros-tramites')
  }

  registrar(){
    // limpiar mensajes
    this._msg.clear('otros-tramites');
    // Verificamos los campos del formulario
    if(this.formFiles.invalid){
      Object.keys(this.formFiles.controls)
            .forEach( inputName => this.formFiles.controls[inputName].markAsDirty() )
      return;
    }

    const pago = new Pago(this.FileDataPago.value.webViewLink,
                          this.FechaPago.value,
                          this.NumOperacion.value,
                          this.MontoPago.value,
                          this.MedioDePago.value);
    const tramite = new Tramite(this.FileDataDocumento.value.webViewLink,
                                this.FileDataDocumentoExtra.value?
                                this.FileDataDocumentoExtra.value.webViewLink:null,
                                this.TipoTramite.value,
                                pago,
                                this.formEstudiante.value);
    this._global.registerTramite( tramite ).subscribe({
      next:(res) => {
        if(res.ok){
          this.resetForms();
          this.toast('success', res.msg, 'otros-tramites');
          return;
        }
      },
      error:(e) => {
        console.log(e)
        this.messageError(e);
      }
    })
  }

  completeDataPersona(persona:Person){
    this.Documento.setValue(persona.dni);
    this.Nombres.setValue(persona.nombres);
    this.ApellidPaterno.setValue(persona.apellidoPaterno);
    this.ApellidoMaterno.setValue(persona.apellidoMaterno);
  }

  getDataReniec(documento:string, isPeru:boolean = true){
    /** verificar si el documento es de perú o del extranjero */
    if(!isPeru) return;
    /** realiza la petición de los datos mediante el enpoint */
    this._global.apiReniec(documento).subscribe({
      next: (value) => {
        if(value.ok){
          console.log(value)
          this.completeDataPersona(value.data);
          this.toast('success',value.msg,'Datos consultados a RENIEC');
          return;
        }
      },
      error: (e) => {
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

  resetForms(){
    this.existsEstudiante    = false;
    this.needSelectCurso     = false;
    this.needOtherfileUpload = false;
    this.montoPago = 0.0;
    this.formEstudiante.reset();
    this.formCurso.reset();
    this.formDocumento.reset();
    this.formFiles.reset();
    this.stepper.reset();
    this.TipoDocumentoTramite.setValue('DNI');
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

  toast(severity:string, summary:string, key?:string, detail?:string){
    this._msg.add({severity, summary, detail, key });
  }

  messageError(e:any, detail:string = 'Error de validación de datos'){
    if(Array.isArray(e.error.message)){
      e.error.message.forEach( (e:string) => {
        this.toast('error', e, 'otros-tramites',detail)
      })
    }else{
      console.log()
      this.toast('error',e.error.message, 'otros-tramites', detail);
    }
  }

}
