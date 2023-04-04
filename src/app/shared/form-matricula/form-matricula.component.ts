import { Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import * as moment from 'moment';

import { Curso } from 'src/app/main/curso/class/Curso';
import { Departamento, Distrito, Provincia } from 'src/app/main/class/Ubigeo';
import { Edad, Escuela, opInstitucion, Sexo } from '../../main/matricula/interfaces/global';
import { GlobalService } from 'src/app/services/global.service';
import { Horario } from 'src/app/main/grupo/class/Horario';
import { MainService } from 'src/app/main/services/main.service';
import { Person } from 'src/app/class/Person';
import { DenominServicio } from 'src/app/denomin-servicio/class/Denomin-servicio';
import { Matricula } from 'src/app/main/matricula/class/Matricula';
import { Estudiante } from 'src/app/main/matricula/class/Estudiante';
import { Institucion } from 'src/app/main/matricula/class/Institucion';
import { MatStepper, MatStepperNext } from '@angular/material/stepper';
import { SocketService } from 'src/app/services/socket.service';
import { Code } from 'src/app/main/grupo/class/Code';
import { Apoderado } from 'src/app/main/matricula/class/Apoderado';

interface Card {
  name: string,
  code: string
}


@Component({
  selector: 'app-form-matricula',
  templateUrl: './form-matricula.component.html',
  styleUrls: ['./form-matricula.component.scss']
})
export class FormMatriculaComponent implements OnInit {

  @ViewChild('stepper') stepper:MatStepper;

  isUpdate:boolean       = false;
  loadGetData:boolean    = false;
  displayMayoria:boolean = false;
  estudiaUnajma:boolean = false;
  isUNAJMA:boolean = false;
  loadGetApoderado:boolean = false;

  formEstudiante:FormGroup;
  formMayorEdad:FormGroup;
  formCurso:FormGroup;
  formAcademica:FormGroup;

  optionSexo:Sexo[];
  optionEdad:Edad[];
  card:Card[] = [];

  optionInstitucion:opInstitucion[];
  optionEscuelas:Escuela[];

  listDepartamentos$:Subscription;
  listProvincias$:Subscription;
  listDistritos$:Subscription;
  listCursos$:Subscription;
  listHorarios$:Subscription;
  listDenominServicio$:Subscription;

  listCursos:Curso[];
  listHorarios:Horario[];
  listDenominServicio:DenominServicio[];

  selecCurso:Curso;
  selecHorario:Horario;

  listDepartamentos:Departamento[];
  listProvincias:Provincia[] = [];
  listDistritos:Distrito[] = [];
  msgTooltipEmail:string;
  msgTooltipCel:string;

  TipoDocumentoSelected:string;
  selecInstitucion:Institucion;
  country:Code;
  today:Date;
  hayError:boolean;

  constructor(private fb:FormBuilder,
              private readonly _global:GlobalService,
              private readonly _msg:MessageService,
              private readonly _socket:SocketService,
              public readonly _main:MainService) {
                this.createFormEstudiante();
                this.createFormMayorEdad();
                this.createFormCurso();
                this.getDepartamentos();
                this.createFormAcademica();
              }

  ngOnInit(): void {

    this._socket.statusServer = true;
    this.TipoDocumentoSelected = 'DNI';
    this.hayError = false;

    this.optionSexo = [
      { name:'Masculino', code:'masculino' },
      { name:'Femenino', code:'Femenino' },
      { name:'otros', code:'otros' },
    ];

    this.optionEdad = [
      { name:'Si', value:true },
      { name:'No', value:false },
    ]

    this.optionInstitucion = [
      { name:'Soy persona externa', value:'persona externa'},
      { name:'Soy estudiante de la UNAJMA', value:'UNAJMA'},
    ]

    this.optionEscuelas = [
      { name: 'Escuela Profesional de Ingeniería de Sistemas', value:'EPIS'},
      { name: 'Escuela Profesional de Ingeniería Agroindustrial', value:'EPIA'},
      { name: 'Escuela Profesional de Ingeniería Ambiental', value:'EPIAM'},
      { name: 'Escuela Profesional de Administración de Empresas', value:'EPAE'},
      { name: 'Escuela Profesional de Contabilidad', value:'EPC'},
      { name: 'Escuela Profesional de Educación Primaria Intercultural', value:'EPEPI'},
    ]

    this.card = [
      {name: 'DNI', code: 'DNI'},
      {name: 'Carnet de extranjería', code: 'CDE' }
    ];
    this.listDepartamentos = [];

    this.msgTooltipEmail = 'Es de suma importancia que verifique que esté correctamente escrito, para el envío de información académica';
    this.msgTooltipCel = 'Es de suma importancia que el número tenga una cuenta de WhatsApp'
    this.today = new Date();
    this.getListCursos();
    this.getListHorarios();
    this.getListDenominServicio();
    this.inicializateCodes();
  }

  inicializateCodes(){
    this.country = { name:'Peru', codePhone:'+51', flag:'https://flagcdn.com/pe.svg', code:'PE'};
  }

  ngOnDestroy(): void {
    if(this.listCursos$) this.listCursos$.unsubscribe();
    if(this.listHorarios$) this.listHorarios$.unsubscribe();
    if(this.listDepartamentos$) this.listDepartamentos$.unsubscribe();
    if(this.listProvincias$) this.listProvincias$.unsubscribe();
    if(this.listDistritos$) this.listDistritos$.unsubscribe();
  }

  createFormEstudiante(){
    this.formEstudiante = this.fb.group({
      TipoDocumento:['DNI', Validators.required],
      Documento:[null, [Validators.required,Validators.pattern(/^([0-9])*$/)]],
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

  createFormMayorEdad(){
    this.formMayorEdad = this.fb.group({
      EsMayor:[null, [Validators.required]],
      DNIApoderado:[null],
      NomApoderado:[null],
      ApellidoPApoderado:[null],
      ApellidoMApoderado:[null],
      CelApoderado:[null],
    })
  }

  createFormCurso(){
    this.formCurso = this.fb.group({
      Curso:[null, Validators.required],
      Modalidad:[null, Validators.required],
      Horario:[null, Validators.required],
    })
  }

  createFormAcademica(){
    this.formAcademica = this.fb.group({
        Poblacion:[null, Validators.required],
        NombreInstitucion:[null, Validators.required],
        EscuelaProfe:[null],
        DeclaraJurada:[null, Validators.required],
        RequiTecnologico:[null, Validators.required],
        CarCompromiso:[null, Validators.required]
    })
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
  get Email(){
    return this.formEstudiante.controls['Email'];
  }
  get Departamento(){
    return this.formEstudiante.controls['Departamento'];
  }
  get Provincia(){
    return this.formEstudiante.controls['Provincia'];
  }
  get Distrito(){
    return this.formEstudiante.controls['Distrito'];
  }


  get EsMayor(){
    return this.formMayorEdad.controls['EsMayor'];
  }
  get DNIApoderado(){
    return this.formMayorEdad.controls['DNIApoderado'];
  }
  get NomApoderado(){
    return this.formMayorEdad.controls['NomApoderado'];
  }
  get ApellidoPApoderado(){
    return this.formMayorEdad.controls['ApellidoPApoderado'];
  }
  get ApellidoMApoderado(){
    return this.formMayorEdad.controls['ApellidoMApoderado'];
  }
  get CelApoderado(){
    return this.formMayorEdad.controls['CelApoderado'];
  }
  get Curso(){
    return this.formCurso.controls['Curso'];
  }
  get Modalidad(){
    return this.formCurso.controls['Modalidad'];
  }
  get Horario(){
    return this.formCurso.controls['Horario'];
  }


  get Poblacion(){
    return this.formAcademica.controls['Poblacion'];
  }
  get NombreInstitucion(){
    return this.formAcademica.controls['NombreInstitucion'];
  }
  get EscuelaProfe(){
    return this.formAcademica.controls['EscuelaProfe'];
  }

  get DeclaraJurada(){
    return this.formAcademica.controls['DeclaraJurada'];
  }
  get RequiTecnologico(){
    return this.formAcademica.controls['RequiTecnologico'];
  }
  get CarCompromiso(){
    return this.formAcademica.controls['CarCompromiso'];
  }

  getListCursos(){
    this.listCursos$ = this._global.getCursosMatricula().subscribe({
      next: (resp) => {
        if(resp.ok){
          this.listCursos = resp.data as Array<Curso>;
        }
      },
      error: (e) => console.log(e)
    })
  }

  getListHorarios(){
    this.listHorarios$ = this._global.getHorariosMatricula().subscribe({
      next: (resp) => {
        if(resp.ok){
          this.listHorarios = resp.data as Array<Horario>;
        }
      },
      error: (e) => {
        console.log(e)
      }
    })
  }

  getListDenominServicio(){
    this.listDenominServicio$ = this._global.getDenominacionServicios().subscribe({
      next: (resp) => {
        if(resp.ok){
          this.listDenominServicio = resp.data as Array<DenominServicio>;
        }
      },
      error: (e) => console.log(e)
    })
  }

  completeDataEstudiante(estudiante:Estudiante){
    console.log("here")
    // complete data estudiante
    this.Nombres.setValue(estudiante.Nombres);
    this.TipoDocumento.setValue(estudiante.TipoDocumento);
    this.Nombres.setValue(estudiante.Nombres);
    this.ApellidoPaterno.setValue(estudiante.ApellidoPaterno);
    this.ApellidoMaterno.setValue(estudiante.ApellidoMaterno);
    this.Sexo.setValue(estudiante.Sexo);
    this.Direccion.setValue(estudiante.Direccion);
    this.Celular.setValue(estudiante.Celular);
    this.Email.setValue(estudiante.Email);
    this.Departamento.setValue(estudiante.departamento);
    this.Provincia.setValue(estudiante.provincia);
    this.Distrito.setValue(estudiante.distrito);
    this.getOneCountryCode(estudiante.Code);
    //verificar si alumno es mayor
    this.EsMayor.setValue(estudiante.EsMayor);
    (!this.EsMayor.value)?this.completeDataApoderado(estudiante.apoderado):'';
  }

  completeData(estudiante:Person){
    this.formEstudiante.controls['Nombres'].setValue(estudiante.nombres);
    this.formEstudiante.controls['ApellidoPaterno'].setValue(estudiante.apellidoPaterno);
    this.formEstudiante.controls['ApellidoMaterno'].setValue(estudiante.apellidoMaterno);
  }

  searchEstudiante(documento:string=''){
    console.log("here")

    if(!documento) return;

    if(this.TipoDocumento.value=='DNI' && documento.length==8 && this.Documento.valid){
      this.getEstudiante(documento);
    }

    if(this.TipoDocumento.value=='CDE' && this.Documento.valid){
      this.getEstudiante(documento, false);
    }

  }

  getEstudiante(documento:string, isPeru:boolean = true){

    this.loadGetData = true;

    this._global.getEstudiante(documento).subscribe({
      next: (value) => {
        if(value.ok){
          //TODO: estudiante existe
          console.log(value.data)
          this.toast('info', value.msg);
          this.completeDataEstudiante(value.data as Estudiante);
          this.loadGetData = false;
        }else{
          //TODO: estudinate no existe
          this.getDataReniec(documento, isPeru);
        }
      },
      error: (err) => {

      }
    })
  }

  getDataReniec(documento:string, isPeru:boolean = true){

    if(!isPeru) return;

    this._global.apiReniec(documento).subscribe({
      next: (value) => {
        if(value.ok){
          this.completeData(value.data);
          this.toast('success',value.msg,'Datos consultados a RENIEC')
        }else{
          this.toast('warn',value.msg,'Datos consultados a RENIEC')
        }
        this.loadGetData = false;
      },
      error: (e) => {
        this.loadGetData = false;
        console.log(e);
      }
    })

  }

  getDepartamentos(){
    this.listDepartamentos$ =this._main.getDepartamentos().subscribe({
      next: (value) => {
        this.listDepartamentos = value;
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  selectedDepartamento(departamento:Departamento){
    this.listDistritos = [];
    if(!departamento) return;
    this.listDistritos$ = this.listProvincias$ = this._main.getProvincias(departamento.IdDepartamento).subscribe({
      next: (value) => {
        this.listProvincias = value;
      },
      error: (e) => console.log(e)
    })
  }

  selectedProvincia(provincia:Provincia){

    if(!provincia) return;
    this._main.getDistritos(provincia.IdProvincia).subscribe({
      next: (value) => {
        this.listDistritos = value;
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  validFormEstudent(){

    console.log("here")
    if(this.formEstudiante.invalid){
      Object.keys(this.formEstudiante.controls).forEach( inputName => {
        this.formEstudiante.controls[inputName].markAsDirty();
      })
      return;
    }

    this._global.getEmailDocEstudiante({Documento:this.Documento.value, Email: this.Email.value})
      .subscribe({
      next: (value) => {
        if(!value.ok){
          this.toast('error', value.msg);
          this.Email.setErrors({notUnique:true});
          this.hayError = true;
        }else{
          this.hayError = false;
          this._msg.clear('message-matricula');
        }
      },
      error: (e) => {
        console.log(e)
        this.messageError(e);
      }
    })

  }

  validFormMayoria(){
    if(this.formMayorEdad.invalid){
      Object.keys(this.formMayorEdad.controls).forEach( inputName => {
        this.formMayorEdad.controls[inputName].markAsDirty();
      })
      return;
    }
  }

  validFormCurso(){
    if(this.formCurso.invalid){
      Object.keys(this.formCurso.controls).forEach( inputName => {
        this.formCurso.controls[inputName].markAsDirty();
      })
      return;
    }
  }

  validFormAcademica(){
    if(this.formAcademica.invalid){
      Object.keys(this.formAcademica.controls).forEach( inputName => {
        this.formAcademica.controls[inputName].markAsDirty();
      })
      return;
    }
  }

  validEdad(fechaNaci:Date){
    if(this.FechaNacimiento.valid){
      const fechaNacimiento = moment(fechaNaci);
      const edad = moment().year() - fechaNacimiento.year()
      if(edad < 18 ){
        this.displayMayoria = true;
        this.DNIApoderado.addValidators([Validators.required,Validators.pattern(/^([0-9])*$/)]);
        this.NomApoderado.addValidators([Validators.required,Validators.pattern(/^([a-z ñáéíóú]{2,60})$/i)]);
        this.ApellidoPApoderado.addValidators([Validators.required,Validators.pattern(/^([a-z ñáéíóú]{1,60})$/i)]);
        this.ApellidoMApoderado.addValidators([Validators.required,Validators.pattern(/^([a-z ñáéíóú]{1,60})$/i)]);
        this.CelApoderado.addValidators([Validators.pattern(/^([0-9])*$/), Validators.required]);
        this.EsMayor.setValue(false);
      }else{
        this.displayMayoria = false;
        this.DNIApoderado.clearValidators();
        this.NomApoderado.clearValidators();
        this.ApellidoPApoderado.clearValidators();
        this.ApellidoMApoderado.clearValidators();
        this.CelApoderado.clearValidators();

        this.DNIApoderado.updateValueAndValidity();
        this.NomApoderado.updateValueAndValidity();
        this.ApellidoMApoderado.updateValueAndValidity();
        this.ApellidoPApoderado.updateValueAndValidity();
        this.CelApoderado.updateValueAndValidity();

        this.DNIApoderado.markAsPristine();
        this.NomApoderado.markAsPristine();
        this.ApellidoPApoderado.markAsPristine();
        this.ApellidoMApoderado.markAsPristine();
        this.CelApoderado.markAsPristine();
        this.EsMayor.setValue(true);
      }
    }
  }

  ready(){

    if(this.formAcademica.invalid){
      Object.keys(this.formAcademica.controls).forEach( input => {
        this.formAcademica.controls[input].markAsDirty();
      })
      return;
    }

    const estudiante = new Estudiante(this.TipoDocumento.value,
                                      this.Documento.value,
                                      this.Nombres.value,
                                      this.ApellidoPaterno.value,
                                      this.ApellidoMaterno.value,
                                      this.Celular.value,
                                      this.country.code,
                                      this.country.codePhone,
                                      this.Sexo.value,
                                      this.FechaNacimiento.value,
                                      this.Direccion.value,
                                      this.Email.value,
                                      this.EsMayor.value,
                                      this.formMayorEdad.value,
                                      this.Departamento.value,
                                      this.Provincia.value,
                                      this.Distrito.value);

    const institucion = new Institucion(this.NombreInstitucion.value,
                                        this.EscuelaProfe.value);

    const matricula = new Matricula(this.DeclaraJurada.value,
                                    this.RequiTecnologico.value,
                                    this.CarCompromiso.value,
                                    estudiante,
                                    this.Poblacion.value,
                                    this.Curso.value,
                                    this.Horario.value,
                                    institucion);
    this._global.registerMatricula(matricula).subscribe({
      next:(value) => {
        if(value.ok){
          this.stepper.reset();
          this.toast('success', value.msg);
          this._socket.EmitEvent('updated_list_matriculados');
        }else{
          this.toast('warn', value.msg);
        }
      },
      error:(e) => {
        console.log(e)
        this.messageError(e)
      }
    })

  }

  selecOptionEdad(value:boolean){
    if(!value){
      this.displayMayoria = true;
      this.DNIApoderado.addValidators([Validators.required,Validators.pattern(/^([0-9])*$/)]);
      this.NomApoderado.addValidators([Validators.required,Validators.pattern(/^([a-z ñáéíóú]{2,60})$/i)]);
      this.ApellidoPApoderado.addValidators([Validators.required,Validators.pattern(/^([a-z ñáéíóú]{1,60})$/i)]);
      this.ApellidoMApoderado.addValidators([Validators.required,Validators.pattern(/^([a-z ñáéíóú]{1,60})$/i)]);
      this.CelApoderado.addValidators([Validators.pattern(/^([0-9])*$/), Validators.required]);
    }else{
      this.displayMayoria = false;
      this.DNIApoderado.clearValidators();
      this.NomApoderado.clearValidators();
      this.ApellidoPApoderado.clearValidators();
      this.ApellidoMApoderado.clearValidators();
      this.CelApoderado.clearValidators();

      this.DNIApoderado.updateValueAndValidity();
      this.NomApoderado.updateValueAndValidity();
      this.ApellidoMApoderado.updateValueAndValidity();
      this.ApellidoPApoderado.updateValueAndValidity();
      this.CelApoderado.updateValueAndValidity();

      this.DNIApoderado.markAsPristine();
      this.NomApoderado.markAsPristine();
      this.ApellidoPApoderado.markAsPristine();
      this.ApellidoMApoderado.markAsPristine();
      this.CelApoderado.markAsPristine();

    }
  }

  selecOptionInstitucion(value:string){

    if(value=='UNAJMA'){
      this.isUNAJMA = true;
      this.EscuelaProfe.addValidators([Validators.required]);
    }else{
      this.isUNAJMA = false;
      this.EscuelaProfe.clearValidators();
      this.EscuelaProfe.updateValueAndValidity();
      this.EscuelaProfe.markAsPristine();
    }

  }

  completeDataApoderado(apoderado:Apoderado){
    // this.DNIApoderado.setValue(apoderado.DNIApoderado);
    this.NomApoderado.setValue(apoderado.NomApoderado);
    this.ApellidoPApoderado.setValue(apoderado.ApellidoPApoderado);
    this.ApellidoMApoderado.setValue(apoderado.ApellidoMApoderado);
    this.CelApoderado.setValue(apoderado.CelApoderado)
  }

  searchApoderado(DNI:string){
    if(DNI.length==8 && this.DNIApoderado.valid){
      this.loadGetApoderado = true;
      this._global.getApoderado(DNI).subscribe({
        next: (value) => {
          this.loadGetApoderado = false;
          if(value.ok){
            console.log(value)
            this.completeDataApoderado(value.data as Apoderado);
          }
        },
        error: (e) => {
          this.loadGetApoderado = false;
          console.log(e)
        }
      })
    }
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

  selectedCurso(curso:Curso){
    this.selecCurso = curso;
  }

  selectedHorario(horario:Horario){
    this.selecHorario = horario;
  }

  changeCard(event:string){
    this.TipoDocumentoSelected = this.TipoDocumento.value;
  }

  selectedCountry(country:Code){
    this.country = country;
  }

  toast(severity:string, summary:string, detail:string=''){
    this._msg.add({severity, summary, detail, key:'message-matricula'});
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
