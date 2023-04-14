import { Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import * as moment from 'moment';

import { Departamento, Distrito, Provincia } from 'src/app/main/class/Ubigeo';
import { Edad, Escuela, opInstitucion, Sexo } from '../../main/matricula/interfaces/global';
import { GlobalService } from 'src/app/services/global.service';
import { MainService } from 'src/app/main/services/main.service';
import { Person } from 'src/app/class/Person';
import { DenominServicio } from 'src/app/denomin-servicio/class/Denomin-servicio';
import { Matricula } from 'src/app/main/matricula/class/Matricula';
import { Estudiante } from 'src/app/main/matricula/class/Estudiante';
import { Institucion } from 'src/app/main/matricula/class/Institucion';
import { MatStepper } from '@angular/material/stepper';
import { SocketService } from 'src/app/services/socket.service';
import { Code } from 'src/app/main/grupo/class/Code';
import { Apoderado } from 'src/app/main/matricula/class/Apoderado';
import { Grupo } from 'src/app/main/grupo/class/Grupo';
import { FileDrive } from 'src/app/main/class/global';
import { EstudianteEnGrupo } from 'src/app/main/grupo/class/EstudianteGrupo';
import { Mensualidad } from 'src/app/main/grupo/class/Mensualidad';

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
  loadingFileMatricula:boolean = false;
  loadingFilePago:boolean = false;
  loadingSave:boolean = false;

  fileMatricula:FileDrive;
  filePago:FileDrive;

  formEstudiante:FormGroup;
  formMayorEdad:FormGroup;
  formGrupo:FormGroup;
  formAcademica:FormGroup;
  formFiles:FormGroup;

  optionSexo:Sexo[];
  optionEdad:Edad[];
  card:Card[] = [];

  file:File;

  optionInstitucion:opInstitucion[];
  optionEscuelas:Escuela[];

  listDepartamentos$:Subscription;
  listProvincias$:Subscription;
  listDistritos$:Subscription;
  listGrupos$:Subscription;
  listDenominServicio$:Subscription;

  listGrupos:Grupo[];
  listDenominServicio:DenominServicio[];

  selecGrupo:Grupo;

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
  isPeru:boolean;

  constructor(private fb:FormBuilder,
              private readonly _global:GlobalService,
              private readonly _msg:MessageService,
              private _socket:SocketService,
              public readonly _main:MainService) {
                this.createFormEstudiante();
                this.createFormMayorEdad();
                this.createformGrupo();
                this.createFormFiles();
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
      { name:'No', value:'persona externa'},
      { name:'Si', value:'UNAJMA'},
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
    this.getListDenominServicio();
    this.getListGrupos();
    this.inicializateCodes();
  }

  inicializateCodes(){
    this.country = { name:'Peru', codePhone:'+51', flag:'https://flagcdn.com/pe.svg', code:'PE'};
    this.isPeru = true;
  }

  ngOnDestroy(): void {
    if(this.listDepartamentos$) this.listDepartamentos$.unsubscribe();
    if(this.listProvincias$) this.listProvincias$.unsubscribe();
    if(this.listDistritos$) this.listDistritos$.unsubscribe();
    if(this.listGrupos$) this.listGrupos$.unsubscribe();
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
      DocumentoApoderado:[null],
      NomApoderado:[null],
      ApellidoPApoderado:[null],
      ApellidoMApoderado:[null],
      CelApoderado:[null]
    })
  }

  createformGrupo(){
    this.formGrupo = this.fb.group({
      grupo:[null, Validators.required],
    })
  }

  createFormFiles(){
    this.formFiles = this.fb.group({
      FileMatriculaURL:[null, Validators.required],
      FilePagoURL:[null, Validators.required]
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
  get DocumentoApoderado(){
    return this.formMayorEdad.controls['DocumentoApoderado'];
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

  get grupo(){
    return this.formGrupo.controls['grupo'];
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

  get FileMatriculaURL(){
    return this.formFiles.controls['FileMatriculaURL'];
  }

  get FilePagoURL(){
    return this.formFiles.controls['FilePagoURL'];
  }

  getListDenominServicio(){
    this.listDenominServicio$ = this._global.getDenominacionServicios().subscribe({
      next: (resp) => {
        if(resp.ok){
          this.listDenominServicio = resp.data as Array<DenominServicio>;
        }
      },
      error: (e) => this.messageError(e)
    })
  }

  getListGrupos(){
    this.listGrupos$ = this._global.getGruposMatricula().subscribe({
      next: (resp) => {
        if(resp.ok){
          this.listGrupos = resp.data as Array<Grupo>;
        }
      },
      error: (e) => this.messageError(e)
    })
  }

  completeDataEstudiante(estudiante:Estudiante){
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
          this.toast('info', value.msg);
          this.completeDataEstudiante(value.data as Estudiante);
        }else{
          //TODO: estudinate no existe
          this.getDataReniec(documento, isPeru);
        }
        this.loadGetData = false;
      },
      error: (e) => {
        this.loadGetData = false;
        console.log(e)
        this.messageError(e);
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

  /** Valid forms */
  validFormEstudent(){

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
      error: (e) => this.messageError(e)
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

  validformGrupo(){
    if(this.formGrupo.invalid){
      Object.keys(this.formGrupo.controls).forEach( inputName => {
        this.formGrupo.controls[inputName].markAsDirty();
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
        this.DocumentoApoderado.addValidators([Validators.required,Validators.pattern(/^([0-9])*$/)]);
        this.NomApoderado.addValidators([Validators.required,Validators.pattern(/^([a-z ñáéíóú]{2,60})$/i)]);
        this.ApellidoPApoderado.addValidators([Validators.required,Validators.pattern(/^([a-z ñáéíóú]{1,60})$/i)]);
        this.ApellidoMApoderado.addValidators([Validators.required,Validators.pattern(/^([a-z ñáéíóú]{1,60})$/i)]);
        this.CelApoderado.addValidators([Validators.pattern(/^([0-9])*$/), Validators.required]);
        this.EsMayor.setValue(false);
      }else{
        this.displayMayoria = false;
        this.DocumentoApoderado.clearValidators();
        this.NomApoderado.clearValidators();
        this.ApellidoPApoderado.clearValidators();
        this.ApellidoMApoderado.clearValidators();
        this.CelApoderado.clearValidators();

        this.DocumentoApoderado.updateValueAndValidity();
        this.NomApoderado.updateValueAndValidity();
        this.ApellidoMApoderado.updateValueAndValidity();
        this.ApellidoPApoderado.updateValueAndValidity();
        this.CelApoderado.updateValueAndValidity();

        this.DocumentoApoderado.markAsPristine();
        this.NomApoderado.markAsPristine();
        this.ApellidoPApoderado.markAsPristine();
        this.ApellidoMApoderado.markAsPristine();
        this.CelApoderado.markAsPristine();
        this.EsMayor.setValue(true);
      }
    }
  }

  ready(){

    if(this.formFiles.invalid){
      Object.keys(this.formFiles.controls).forEach( input => {
        this.formFiles.controls[input].markAsDirty();
      })
      return;
    }

    const apoderado = new Apoderado(this.TipoDocumento.value,
                                    this.DocumentoApoderado.value,
                                    this.NomApoderado.value,
                                    this.ApellidoPApoderado.value,
                                    this.ApellidoMApoderado.value,
                                    this.CelApoderado.value,
                                    this.country.code,
                                    this.country.codePhone);

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
                                      apoderado,
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
                                    institucion,
                                    this.fileMatricula.webViewLink);
    const mensualidad = new Mensualidad(this.filePago.webViewLink);
    const estudianteEnGrupo = new EstudianteEnGrupo(estudiante, this.selecGrupo, matricula, mensualidad);
    this.selecGrupo.RequeridoPPago?this.registerMatricula(estudianteEnGrupo):this.registerPrematricula(matricula);

  }

  registerMatricula(estudianteEnGrupo:EstudianteEnGrupo){
    this.loadingSave = true;
    this._global.registerMatricula(estudianteEnGrupo).subscribe({
      next:(value) => {
        if(value.ok){
          console.log(value)
          this.stepper.reset();
          this.toast('success', value.msg);
          this._socket.EmitEvent('updated_list_matriculados');
        }else{
          this.toast('warn', value.msg);
        }
        this.loadingSave = false;
      },
      error:(e) => {
        this.loadingSave = false;
        this.messageError(e)
      }
    })
  }

  registerPrematricula(matricula:Matricula){
    matricula.setCurso(this.selecGrupo.curso);
    matricula.setHorario(this.selecGrupo.horario);
    this.loadingSave = true;
    this._global.registerPrematricula(matricula).subscribe({
      next:(value) => {
        if(value.ok){
          console.log(value)
          this.stepper.reset();
          this.toast('success', value.msg);
          this._socket.EmitEvent('updated_list_matriculados');
        }else{
          this.toast('warn', value.msg);
        }
        this.loadingSave = false;
      },
      error:(e) => {
        this.loadingSave = false;
        this.messageError(e)
      }
    })
  }

  selecOptionEdad(value:boolean){
    if(!value){
      this.displayMayoria = true;
      this.DocumentoApoderado.addValidators([Validators.required,Validators.pattern(/^([0-9])*$/)]);
      this.NomApoderado.addValidators([Validators.required,Validators.pattern(/^([a-z ñáéíóú]{2,60})$/i)]);
      this.ApellidoPApoderado.addValidators([Validators.required,Validators.pattern(/^([a-z ñáéíóú]{1,60})$/i)]);
      this.ApellidoMApoderado.addValidators([Validators.required,Validators.pattern(/^([a-z ñáéíóú]{1,60})$/i)]);
      this.CelApoderado.addValidators([Validators.pattern(/^([0-9])*$/), Validators.required]);
    }else{
      this.displayMayoria = false;
      this.DocumentoApoderado.clearValidators();
      this.NomApoderado.clearValidators();
      this.ApellidoPApoderado.clearValidators();
      this.ApellidoMApoderado.clearValidators();
      this.CelApoderado.clearValidators();

      this.DocumentoApoderado.updateValueAndValidity();
      this.NomApoderado.updateValueAndValidity();
      this.ApellidoMApoderado.updateValueAndValidity();
      this.ApellidoPApoderado.updateValueAndValidity();
      this.CelApoderado.updateValueAndValidity();

      this.DocumentoApoderado.markAsPristine();
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
    if(DNI.length==8 && this.DocumentoApoderado.valid){
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
      error:(e) => this.messageError(e)
    })
  }

  changeCard(event:string){
    this.TipoDocumentoSelected = this.TipoDocumento.value;
  }

  clearValidatorsPago(){
    this.FilePagoURL.clearValidators();
    this.FilePagoURL.updateValueAndValidity();
    this.FilePagoURL.markAsPristine();
  }

  addValidatorPago(){
    this.FilePagoURL.addValidators([Validators.required]);
  }

  selectGrupo(event:Grupo){
    this.selecGrupo = event;
    console.log(this.selecGrupo)
    this.selecGrupo.RequeridoPPago?this.addValidatorPago():this.clearValidatorsPago();
  }

  requiredCountry(){
    this.Departamento.addValidators([Validators.required]);
    this.Provincia.addValidators([Validators.required]);
    this.Distrito.addValidators([Validators.required]);
  }

  notRequiredCountry(){

      this.Departamento.clearValidators();
      this.Provincia.clearValidators();
      this.Distrito.clearValidators();

      this.Departamento.updateValueAndValidity();
      this.Provincia.updateValueAndValidity();
      this.Distrito.updateValueAndValidity();

      this.Departamento.markAsPristine();
      this.Provincia.markAsPristine();
      this.Distrito.markAsPristine();

  }

  selectedCountry(country:Code){
    this.country = country;
    this.isPeru = (this.country.code!='PE')?false:true;
    this.isPeru?this.requiredCountry():this.notRequiredCountry();
  }

  onFileMatriculaChange(fileChangeEvent:any) {
    this.file = fileChangeEvent.target.files[0];
    if(!this.file )return;
    this.loadingFileMatricula = true;
    this.FileMatriculaURL.disable();
    let formData = new FormData();
    formData.append('file', this.file, this.file.name);
    formData.append('id_grupo', String(this.selecGrupo.Id));
    formData.append('tipo', 'matricula');
    this._global.uploadFileMatricula(formData).subscribe({
      next: (value) => {
        this.loadingFileMatricula = false;
        this.FileMatriculaURL.enable();
        this.fileMatricula = value;
      },
      error: (e) => {
        this.FileMatriculaURL.enable();
        this.loadingFileMatricula = false;
        this.messageError(e)
      },
    })
  }

  onFilePagoChange(fileChangeEvent:any) {
    this.file = fileChangeEvent.target.files[0];
    if(!this.file )return;
    this.loadingFilePago = true;
    this.FilePagoURL.disable();
    let formData = new FormData();
    formData.append('file', this.file, this.file.name);
    formData.append('id_grupo', String(this.selecGrupo.Id));
    formData.append('tipo', 'mensualidad');

    this._global.uploadFileMatricula(formData).subscribe({
      next: (value) => {
        this.loadingFilePago = false;
        this.FilePagoURL.enable();
        this.filePago = value;
      },
      error: (e) => {
        this.FilePagoURL.enable();
        this.loadingFilePago = false;
        this.messageError(e)
      }
    })
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
