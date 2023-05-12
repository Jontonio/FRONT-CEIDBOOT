import { Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Message, MessageService } from 'primeng/api';
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
import { Pago } from 'src/app/main/grupo/class/Pago';
import { ShowFileComponent } from '../show-file/show-file.component';
import { Libro } from 'src/app/main/curso/class/Libro';
import { CategoriaPago } from 'src/app/main/grupo/class/CategoriaPago';
import { AuthService } from 'src/app/auth/services/auth.service';
import { MedioPago } from 'src/app/class/MedioDePago';
import { OverlayPanel } from 'primeng/overlaypanel';

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
  @ViewChild(ShowFileComponent) showFile:ShowFileComponent;
  @ViewChild('opEmail')   opEmail:OverlayPanel;
  @ViewChild('opCelular') opCelular:OverlayPanel;

  isUpdate:boolean       = false;
  loadGetData:boolean    = false;
  displayMayoria:boolean = false;
  estudiaUnajma:boolean  = false;
  isUNAJMA:boolean = false;
  loadGetApoderado:boolean = false;
  loadingDocumentoMatricula:boolean = false;
  loadingFilePagoMensualidad:boolean = false;
  loadingFilePagoMatricula:boolean = false;
  loadingFilePagoLibro:boolean = false;

  loadingSave:boolean = false;

  resDocumentoMatricula:FileDrive;
  resFilePagoMensualidad:FileDrive;
  resFilePagoLibro:FileDrive;
  resFilePagoMatricula:FileDrive;

  formEstudiante:FormGroup;
  formMayorEdad:FormGroup;
  formGrupo:FormGroup;
  formAcademica:FormGroup;
  formFiles:FormGroup;

  optionSexo:Sexo[];
  optionEdad:Edad[];
  card:Card[] = [];

  optionInstitucion:opInstitucion[];
  optionEscuelas:Escuela[];

  listDepartamentos$:Subscription;
  listProvincias$:Subscription;
  listDistritos$:Subscription;
  listGrupos$:Subscription;
  listDenominServicio$:Subscription;

  listGrupos:Grupo[];
  listDenominServicio:DenominServicio[];

  selecGrupo:Grupo | undefined;

  listDepartamentos:Departamento[];
  listProvincias:Provincia[] = [];
  listDistritos:Distrito[] = [];
  listMedioPago:MedioPago[] = [];

  TipoDocumentoSelected:string;
  selecInstitucion:Institucion;
  country:Code;
  today:Date;
  hayError:boolean;
  isPeru:boolean;
  messages: Message[];
  xampleFileURL:string;
  hayErrorGetData:boolean;

  constructor(private fb:FormBuilder,
              private readonly _global:GlobalService,
              private readonly _msg:MessageService,
              private _socket:SocketService,
              private _auth:AuthService,
              public readonly _main:MainService) {
                this.createFormEstudiante();
                this.createFormMayorEdad();
                this.createformGrupo();
                this.createFormFiles();
                this.getDepartamentos();
                this.createFormAcademica();
              }

  ngOnInit(): void {

    this.messages = [{ severity: 'warn', summary: 'Formatos permitidos', detail: '(PDF - PNG - JPG)' }];
    this.xampleFileURL = ''
    this._socket.statusServer = true;
    this.TipoDocumentoSelected = 'DNI';
    this.hayError = false;
    this.hayErrorGetData = false;

    this.optionSexo = [
      { name:'Masculino', code:'masculino' },
      { name:'Femenino', code:'Femenino' },
      { name:'otros', code:'otros' },
    ];

    this.card = [
      {name: 'DNI', code: 'DNI'},
      {name: 'Carnet de extranjería', code: 'CDE' }
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


    this.listDepartamentos = [];
    this.today = new Date();
    this.getListDenominServicio();
    this.getListGrupos();
    this.getMediosPagos();
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
    /**
     * Note:
     * existe inputs con categoria de pago
     * estas categorias están registradas en la
     * base de datos en donde:
     * - mensualidad = 1
     * - matricula   = 2
     * - libro       = 3
     * - certificado = 4
     */
    this.formFiles = this.fb.group({
      fileDocumentoMatricula:[null, Validators.required],
      filePagoMatricula:[null, Validators.required],
      NumOperacionMatricula:[null, [Validators.required, Validators.pattern(/^([0-9])*$/)]],
      FechaPagoMatricula:[null, [Validators.required, Validators.pattern(/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[012])\/\d{4}$/)]],
      MontoPagoMatricula:[null, [Validators.required, Validators.pattern(/^([0-9])+(.[0-9]+)?$/)]],
      MontoPagoMensualidad:[null, [Validators.required, Validators.pattern(/^([0-9])+(.[0-9]+)?$/)]],
      MontoPagoLibro:[null, [Validators.pattern(/^([0-9])+(.[0-9]+)?$/)]],
      filePagoLibro:[null, Validators.required],
      NumOperacionLibro:[null, [Validators.required, Validators.pattern(/^([0-9])*$/)]],
      FechaPagoLibro:[null, [Validators.required, Validators.pattern(/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[012])\/\d{4}$/)]],
      filePagoMensualidad:[null, Validators.required],
      NumOperacionMensualidad:[null, [Validators.required, Validators.pattern(/^([0-9])*$/)]],
      FechaPagoMensualidad:[null, [Validators.required, Validators.pattern(/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[012])\/\d{4}$/)]],
      medioPagoMensualidad:[null, Validators.required],
      medioPagoLibro:[null, Validators.required],
      medioPagoMatricula:[null, Validators.required],
      idCatMensualidad:[1, Validators.required],
      idCatMatricula:[2, Validators.required],
      idCatLibro:[3, Validators.required],
      // idCatCertificado:[4, Validators.required]
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

  /** Formulario files */
  get filePagoMatricula(){
    return this.formFiles.controls['filePagoMatricula'];
  }
  get fileDocumentoMatricula(){
    return this.formFiles.controls['fileDocumentoMatricula'];
  }
  get NumOperacionMatricula(){
    return this.formFiles.controls['NumOperacionMatricula'];
  }
  get FechaPagoMatricula(){
    return this.formFiles.controls['FechaPagoMatricula'];
  }
  get filePagoLibro(){
    return this.formFiles.controls['filePagoLibro'];
  }
  get NumOperacionLibro(){
    return this.formFiles.controls['NumOperacionLibro'];
  }
  get FechaPagoLibro(){
    return this.formFiles.controls['FechaPagoLibro'];
  }
  get filePagoMensualidad(){
    return this.formFiles.controls['filePagoMensualidad'];
  }
  get NumOperacionMensualidad(){
    return this.formFiles.controls['NumOperacionMensualidad'];
  }
  get FechaPagoMensualidad(){
    return this.formFiles.controls['FechaPagoMensualidad'];
  }
  get medioPagoMensualidad(){
    return this.formFiles.controls['medioPagoMensualidad'];
  }
  get medioPagoLibro(){
    return this.formFiles.controls['medioPagoLibro'];
  }
  get medioPagoMatricula(){
    return this.formFiles.controls['medioPagoMatricula'];
  }

  get MontoPagoMatricula(){
    return this.formFiles.controls['MontoPagoMatricula'];
  }
  get MontoPagoMensualidad(){
    return this.formFiles.controls['MontoPagoMensualidad'];
  }
  get MontoPagoLibro(){
    return this.formFiles.controls['MontoPagoLibro'];
  }
  get idCatMensualidad(){
    return this.formFiles.controls['idCatMensualidad'];
  }
  get idCatMatricula(){
    return this.formFiles.controls['idCatMatricula'];
  }
  get idCatLibro(){
    return this.formFiles.controls['idCatLibro'];
  }
  // get idCatCertificado(){
  //   return this.formFiles.controls['idCatCertificado'];
  // }

  getMediosPagos() {
    this._global.getMediosDePago().subscribe({
      next:(res) => {
        if(res.ok){
          this.listMedioPago = res.data as Array<MedioPago>;
        }
      },
      error:(e) => {
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
        this.hayErrorGetData = false;
      },
      error: (e) => {
        this.hayErrorGetData = true;
      }
    })
  }

  getListGrupos(){
    this.listGrupos$ = this._global.getGruposMatricula().subscribe({
      next: (resp) => {
        if(resp.ok){
          this.listGrupos = resp.data as Array<Grupo>;
          console.log(resp.data)
        }
        this.hayErrorGetData = false;
      },
      error: (e) => {
        this.hayErrorGetData = true;
      }
    })
  }

  completeDataEstudiante(estudiante:Estudiante){
    /** complete data estudiante */
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
    /** verificar si alumno es mayor */
    this.EsMayor.setValue(estudiante.EsMayor);
    (!this.EsMayor.value)?this.completeDataApoderado(estudiante.apoderado):'';
  }

  completeData(estudiante:Person){
    this.formEstudiante.controls['Nombres'].setValue(estudiante.nombres);
    this.formEstudiante.controls['ApellidoPaterno'].setValue(estudiante.apellidoPaterno);
    this.formEstudiante.controls['ApellidoMaterno'].setValue(estudiante.apellidoMaterno);
  }

  searchEstudiante(documento:string=''){
    /** verificar si el documento no este vacia*/
    if(!documento) return;
    /** validar para hacer la busqueda del documento en RENIEC */
    (this.TipoDocumento.value=='DNI' && documento.length==8 && this.Documento.valid)?this.getDataReniec(documento, true):''
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

  getDepartamentos(){
    this.listDepartamentos$ =this._main.getDepartamentos().subscribe({
      next: (value) => {
        this.listDepartamentos = value;
        this.hayErrorGetData = false;
      },
      error: (e) => {
        this.hayErrorGetData = true;
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
                                    this.resDocumentoMatricula.webViewLink,
                                    this.selecGrupo!.curso,
                                    this.selecGrupo!.horario);

    if(this.selecGrupo!.RequeridoPPago){
      let listPagos:Pago[] = [];
      if(this.filePagoMatricula.value){
        const catMatricula = { Id: this.idCatMatricula.value };
        const pagoMatricula = new Pago(this.resFilePagoMatricula.webViewLink,
                                       moment(this.FechaPagoMatricula.value,'DD/MM/YYYY').toDate(),
                                       this.NumOperacionMatricula.value,
                                       this.MontoPagoMatricula.value,
                                       this.medioPagoMatricula.value,
                                       catMatricula as CategoriaPago);
        listPagos.push(pagoMatricula);
      }
      if(this.filePagoLibro.value){
        const catLibro = { Id: this.idCatLibro.value };
        const pagoLibro = new Pago(this.resFilePagoLibro.webViewLink,
                                   moment(this.FechaPagoLibro.value,'DD/MM/YYYY').toDate(),
                                   this.NumOperacionLibro.value,
                                   this.MontoPagoLibro.value,
                                   this.medioPagoLibro.value,
                                   catLibro as CategoriaPago);
        listPagos.push(pagoLibro);
      }
      if(this.filePagoMensualidad.value){
        const catMensualidad = { Id: this.idCatMensualidad.value };
        const pagoMensualidad = new Pago(this.resFilePagoMensualidad.webViewLink,
                                         moment(this.FechaPagoMensualidad.value,'DD/MM/YYYY').toDate(),
                                         this.NumOperacionMensualidad.value,
                                         this.MontoPagoMensualidad.value,
                                         this.medioPagoMensualidad.value,
                                         catMensualidad as CategoriaPago);
        listPagos.push(pagoMensualidad);
      }
      const estudianteEnGrupo = new EstudianteEnGrupo(estudiante, this.selecGrupo!, matricula, listPagos);
      this.registerMatricula(estudianteEnGrupo);
    }else{
      this.registerPrematricula(matricula);
    }

  }

  registerMatricula(estudianteEnGrupo:EstudianteEnGrupo){
    this.loadingSave = true;
    this._global.registerMatricula(estudianteEnGrupo).subscribe({
      next:(value) => {
        if(value.ok){
          console.log(value)
          this.resetFroms();
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
    matricula.setCurso(this.selecGrupo!.curso);
    matricula.setHorario(this.selecGrupo!.horario);
    this.loadingSave = true;
    this._global.registerPrematricula(matricula).subscribe({
      next:(value) => {
        if(value.ok){
          console.log(value)
          this.resetFroms();
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

  resetFroms(){
    this.stepper.reset();
    this.selecGrupo = undefined;
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

  searchApoderado(DNI:string=''){
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

  clearValidatorsLibro(){
    /** reset value */
    this.filePagoLibro.setValue(null);
    this.NumOperacionLibro.setValue(null);
    this.FechaPagoLibro.setValue(null);
    /** clear validators */
    this.filePagoLibro.clearValidators();
    this.filePagoLibro.updateValueAndValidity();
    this.filePagoLibro.markAsPristine();
    this.NumOperacionLibro.clearValidators();
    this.NumOperacionLibro.updateValueAndValidity();
    this.NumOperacionLibro.markAsPristine();
    this.FechaPagoLibro.clearValidators();
    this.FechaPagoLibro.updateValueAndValidity();
    this.FechaPagoLibro.markAsPristine();
    /** clear validator medio pago */
    this.medioPagoLibro.clearValidators();
    this.medioPagoLibro.updateValueAndValidity();
    this.medioPagoLibro.markAsPristine();
  }

  addValidatorsLibro(){
    this.filePagoLibro.addValidators([Validators.required]);
    this.NumOperacionLibro.addValidators([Validators.required, Validators.pattern(/^([0-9])*$/)]);
    this.FechaPagoLibro.addValidators([Validators.required, Validators.pattern(/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[012])\/\d{4}$/)]);
    /** add validator medio pago */
    this.medioPagoLibro.addValidators([Validators.required]);
  }

  clearValidatorsMensualidad(){
    /** reset value */
    this.filePagoMensualidad.setValue(null);
    this.NumOperacionMensualidad.setValue(null);
    this.FechaPagoMensualidad.setValue(null);
    /** clear validators */
    this.filePagoMensualidad.clearValidators();
    this.filePagoMensualidad.updateValueAndValidity();
    this.filePagoMensualidad.markAsPristine();
    this.NumOperacionMensualidad.clearValidators();
    this.NumOperacionMensualidad.updateValueAndValidity();
    this.NumOperacionMensualidad.markAsPristine();
    this.FechaPagoMensualidad.clearValidators();
    this.FechaPagoMensualidad.updateValueAndValidity();
    this.FechaPagoMensualidad.markAsPristine();
    /** clear validator medio pago */
    this.medioPagoMensualidad.clearValidators();
    this.medioPagoMensualidad.updateValueAndValidity();
    this.medioPagoMensualidad.markAsPristine();
  }

  addValidatorsMensualidad(){
    this.filePagoMensualidad.addValidators([Validators.required]);
    this.NumOperacionMensualidad.addValidators([Validators.required, Validators.pattern(/^([0-9])*$/)]);
    this.FechaPagoMensualidad.addValidators([Validators.required, Validators.pattern(/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[012])\/\d{4}$/)]);
    /** add validator medio pago */
    this.medioPagoMensualidad.addValidators([Validators.required]);
  }

  clearValidatorsMatricula(){
    /** reset value */
    this.filePagoMatricula.setValue(null);
    this.NumOperacionMatricula.setValue(null);
    this.FechaPagoMatricula.setValue(null);
    /** clear validators */
    this.filePagoMatricula.clearValidators();
    this.filePagoMatricula.updateValueAndValidity();
    this.filePagoMatricula.markAsPristine();
    this.NumOperacionMatricula.clearValidators();
    this.NumOperacionMatricula.updateValueAndValidity();
    this.NumOperacionMatricula.markAsPristine();
    this.FechaPagoMatricula.clearValidators();
    this.FechaPagoMatricula.updateValueAndValidity();
    this.FechaPagoMatricula.markAsPristine();
     /** clear validator medio pago */
     this.medioPagoMatricula.clearValidators();
     this.medioPagoMatricula.updateValueAndValidity();
     this.medioPagoMatricula.markAsPristine();
  }

  addValidatorsMatricula(){
    this.filePagoMatricula.addValidators([Validators.required]);
    this.NumOperacionMatricula.addValidators([Validators.required, Validators.pattern(/^([0-9])*$/)]);
    this.FechaPagoMatricula.addValidators([Validators.required, Validators.pattern(/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[012])\/\d{4}$/)]);
     /** add validator medio pago */
     this.medioPagoMatricula.addValidators([Validators.required]);
  }

  clearRequierePago(){
    this.clearValidatorsLibro();
    this.clearValidatorsMatricula();
    this.clearValidatorsMensualidad();
  }

  addValidatorRequierePago(){
    this.addValidatorsLibro();
    this.addValidatorsMatricula();
    this.addValidatorsMensualidad();
  }

  selectGrupo(grupo:Grupo){
    if(!grupo) return;
    this.selecGrupo = grupo;
    this.selecGrupo.RequeridoPPago?this.addValidatorRequierePago():this.clearRequierePago();
    this.countLibros(grupo.curso.libros)==0?this.clearValidatorsLibro():this.addValidatorsLibro();
    this.getFirstPriceBook(grupo.curso.libros);
  }

  getFirstPriceBook(libro:Libro[]){
    const costoLibro = (libro.length!=0)?libro[0].CostoLibro:null;
    this.MontoPagoLibro.setValue(costoLibro?costoLibro:null);
    this.MontoPagoLibro.disable();
    this.MontoPagoLibro.patchValue(costoLibro?costoLibro:null);
  }

  selectServicio(servicio:DenominServicio){
    if(!servicio) return;
    this.MontoPagoMensualidad.setValue(servicio.MontoPension);
    this.MontoPagoMatricula.setValue(servicio.MontoMatricula);
    this.MontoPagoMatricula.disable();
    this.MontoPagoMensualidad.disable();
    this.MontoPagoMensualidad.patchValue(servicio.MontoPension);
    this.MontoPagoMatricula.patchValue(servicio.MontoMatricula);
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

  onDocumentoMatriculaChange(fileChangeEvent:any) {
    const file = fileChangeEvent.target.files[0];
    if( !file )return;
    this.loadingDocumentoMatricula = true;
    this.fileDocumentoMatricula.disable();
    const direccion = 'requisitos';
    let formData = new FormData();
    formData.append('file', file, file.name);
    formData.append('id_grupo', String(this.selecGrupo!.Id));
    formData.append('tipo', direccion);
    this._global.uploadFile(formData).subscribe({
      next: (value) => {
        this.loadingDocumentoMatricula = false;
        this.fileDocumentoMatricula.enable();
        this.resDocumentoMatricula = value;
      },
      error: (e) => {
        this.fileDocumentoMatricula.enable();
        this.fileDocumentoMatricula.setValue(null);
        this.loadingDocumentoMatricula = false;
        this.messageError(e,`Vuelve a intentar con ${direccion} de matrícula`);
      },
    })
  }

  onFilePagoMatriculaChange(fileChangeEvent:any) {
    const file = fileChangeEvent.target.files[0];
    if( !file )return;
    this.loadingFilePagoMatricula = true;
    this.filePagoMatricula.disable();
    const direccion = 'matricula';
    let formData = new FormData();
    formData.append('file', file, file.name);
    formData.append('id_grupo', String(this.selecGrupo!.Id));
    formData.append('tipo', direccion);
    this._global.uploadFile(formData).subscribe({
      next: (value) => {
        this.loadingFilePagoMatricula = false;
        this.filePagoMatricula.enable();
        this.resFilePagoMatricula = value;
      },
      error: (e) => {
        this.filePagoMatricula.enable();
        this.filePagoMatricula.setValue(null);
        this.loadingFilePagoMatricula = false;
        this.messageError(e,`Vuelve a intentar con pago de ${direccion}`);
      },
    })
  }

  onFilePagoMensualidadChange(fileChangeEvent:any) {
    const file = fileChangeEvent.target.files[0];
    if( !file )return;
    this.loadingFilePagoMensualidad = true;
    this.filePagoMensualidad.disable();
    const direccion = 'mensualidad';
    let formData = new FormData();
    formData.append('file', file, file.name);
    formData.append('id_grupo', String(this.selecGrupo!.Id));
    formData.append('tipo', direccion);

    this._global.uploadFile(formData).subscribe({
      next: (value) => {
        this.loadingFilePagoMensualidad = false;
        this.filePagoMensualidad.enable();
        this.resFilePagoMensualidad = value;
      },
      error: (e) => {
        this.filePagoMensualidad.enable();
        this.filePagoMensualidad.setValue(null);
        this.loadingFilePagoMensualidad = false;
        this.messageError(e,`Vuelve a intentar con pago de ${direccion}`);
      }
    })
  }

  onFilePagoLibroChange(fileChangeEvent:any) {
    const file = fileChangeEvent.target.files[0];
    if( !file )return;
    this.loadingFilePagoLibro = true;
    const direccion = 'libro';
    this.filePagoLibro.disable();
    let formData = new FormData();
    formData.append('file', file, file.name);
    formData.append('id_grupo', String(this.selecGrupo!.Id));
    formData.append('tipo', direccion);

    this._global.uploadFile(formData).subscribe({
      next: (value) => {
        this.loadingFilePagoLibro = false;
        this.filePagoLibro.enable();
        this.resFilePagoLibro = value;
      },
      error: (e) => {
        this.filePagoLibro.enable();
        this.filePagoLibro.setValue(null);
        this.loadingFilePagoLibro = false;
        this.messageError(e,`Vuelve a intentar con pago de ${direccion}`)
      }
    })
  }

  cerrarPanelEmail(evento: KeyboardEvent) {
    this.opEmail.hide();
  }

  cerrarPanelCelular(evento: KeyboardEvent) {
    this.opCelular.hide();
  }

  countLibros(libros:Libro[]){
    return libros.filter( libro => libro.Estado == true ).length;
  }

  toast(severity:string, summary:string, detail:string=''){
    this._msg.add({severity, summary, detail, key:'message-matricula'});
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
