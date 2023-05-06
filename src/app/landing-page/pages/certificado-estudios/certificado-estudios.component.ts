import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { MessageService } from 'primeng/api';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-certificado-estudios',
  templateUrl: './certificado-estudios.component.html',
  styleUrls: ['./certificado-estudios.component.scss']
})
export class CertificadoEstudiosComponent implements OnInit {

  @ViewChild('stepper') stepper:MatStepper;

  formEstudiante:FormGroup;
  hayError:boolean;

  constructor( private readonly fb:FormBuilder,
               private readonly _global:GlobalService,
               private _msg:MessageService) {
    this.createFormEstudiante();
  }

  ngOnInit(): void {
    this.hayError = false;
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
  // getters
  get Documento(){
    return this.formEstudiante.controls['Documento'];
  }
  get Email(){
    return this.formEstudiante.controls['Email'];
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

  goBack(){
    // siguiente formulario
    this.stepper.previous();
  }

  goForward(){
    // siguiente formulario
    this.stepper.next();
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
