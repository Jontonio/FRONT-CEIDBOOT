import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { MessageService } from 'primeng/api';
import { Curso } from 'src/app/main/curso/class/Curso';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-examen-suficiencia',
  templateUrl: './examen-suficiencia.component.html',
  styleUrls: ['./examen-suficiencia.component.scss']
})
export class ExamenSuficienciaComponent implements OnInit {

  @ViewChild('stepper') stepper:MatStepper;

  formEstudiante:FormGroup;
  formCurso     :FormGroup;
  formFiles     :FormGroup;
  hayError:boolean;
  loadingDocumento:boolean;
  loadingFilePago :boolean;
  selectCurso:Curso;

  constructor( private readonly fb:FormBuilder,
               private readonly _global:GlobalService,
               private readonly _msg:MessageService ) {
    this.createFormEstudiante();
    this.createFormCurso();
    this.createFormFiles();
  }

  ngOnInit(): void {
    this.hayError = false;
    this.loadingDocumento = false;
    this.loadingFilePago = false;
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

  createFormCurso(){
    this.formCurso = this.fb.group({ curso:[null, Validators.required ] })
  }

  createFormFiles(){
    this.formFiles = this.fb.group({
      FileDocumento:[null, Validators.required ],
      FileDataDocumento:[null, Validators.required ],
      MontoPago:[null, Validators.required ],
      NumOperacion:[null, Validators.required ],
      FechaPago:[null, [Validators.required, Validators.pattern(/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[012])\/\d{4}$/)]],
      FilePago:[null, Validators.required ],
      FileDataPago:[null, Validators.required ],
    })
  }

  // getters
  get Documento(){
    return this.formEstudiante.controls['Documento'];
  }
  get Email(){
    return this.formEstudiante.controls['Email'];
  }
  get curso(){
    return this.formCurso.controls['curso'];
  }

  goBack(){
    // siguiente formulario
    this.stepper.previous();
  }

  goForward(){
    // siguiente formulario
    this.stepper.next();
  }

  /** Valid forms */
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

  readyCurso(){
    // Verificamos los campos del formulario
    if(this.formCurso.invalid){
      Object.keys(this.formCurso.controls).forEach( inputName => this.formCurso.controls[inputName].markAsDirty() )
      return;
    }
    // Avanzamos al siguiente formulario
    this.selectCurso = this.curso.value;
    this.goForward();
  }

  registrar(){
    // Verificamos los campos del formulario
    if(this.formFiles.invalid){
      Object.keys(this.formFiles.controls).forEach( inputName => this.formFiles.controls[inputName].markAsDirty() )
      return;
    }
    // Avanzamos al siguiente formulario
    console.log(this.formEstudiante.value)
    console.log(this.formCurso.value)
    console.log(this.formFiles.value)
  }

  stateLoadingDocumento(event:boolean){
    this.loadingDocumento = event;
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
