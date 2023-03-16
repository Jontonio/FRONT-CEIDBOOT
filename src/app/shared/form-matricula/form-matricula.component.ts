import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Person } from 'src/app/class/Person';
import { MainService } from 'src/app/main/services/main.service';
import { GlobalService } from 'src/app/services/global.service';
import { Departamento, Distrito, Provincia } from 'src/app/main/class/Ubigeo';
import { Subscription } from 'rxjs';
import { Edad, Escuela, Institucion, Modalidad, Sexo } from '../../main/matricula/interfaces/global';
import * as moment from 'moment';
import { Curso } from 'src/app/main/curso/class/Curso';
import { Horario } from 'src/app/main/grupo/class/Horario';

@Component({
  selector: 'app-form-matricula',
  templateUrl: './form-matricula.component.html',
  styleUrls: ['./form-matricula.component.scss']
})
export class FormMatriculaComponent implements OnInit {
  firstFormGroup = this.fb.group({
    firstCtrl: ['', Validators.required],
  });
  secondFormGroup = this.fb.group({
    secondCtrl: ['', Validators.required],
  });

  isUpdate:boolean       = false;
  loadGetData:boolean    = false;
  displayMayoria:boolean = false;
  estudiaUnajma:boolean = false;

  formEstudiante:FormGroup;
  formMayorEdad:FormGroup;
  formCurso:FormGroup;
  formAcademica:FormGroup;

  optionSexo:Sexo[];
  optionEdad:Edad[];
  optionInstitucion:Institucion[];
  optionEscuelas:Escuela[];
  optionModalidad:Modalidad[];

  listDepartamentos$:Subscription;
  listProvincias$:Subscription;
  listDistritos$:Subscription;
  listCursos$:Subscription;
  listHorarios$:Subscription;

  listCursos:Curso[];
  listHorarios:Horario[];
  selecCurso:Curso;
  selecHorario:Horario;

  listDepartamentos:Departamento[] = [];
  listProvincias:Provincia[] = [];
  listDistritos:Distrito[] = [];
  msgTooltipEmail:string;
  msgTooltipCel:string;

  selecInstitucion:Institucion;

  constructor(private fb:FormBuilder,
              private readonly _global:GlobalService,
              private readonly _msg:MessageService,
              private readonly _main:MainService) {
                this.createFormEstudiante();
                this.createFormMayorEdad();
                this.createFormCurso();
                this.getDepartamentos();
                this.createFormAcademica();
              }

  ngOnInit(): void {

    this.optionSexo = [
      { name:'Masculino', code:'masculino' },
      { name:'Femenino', code:'Femenino' },
      { name:'otros', code:'otros' },
    ];

    this.optionEdad = [
      { name:'Soy mayor de edad', value:true },
      { name:'Soy menor de edad', value:false },
    ]

    this.optionInstitucion = [
      { name:'No soy estudiante', value:'No soy estudiante', code:0 },
      { name:'Soy estudiante de la UNAJMA', value:'estudiante unajma', code: 1},
      { name:'Soy estudiante externo', value:'estudiante externo', code: 2},
    ]

    this.optionEscuelas = [
      { name: 'Escuela Profesional de Ingeniería de Sistemas', value:'EPIS'},
      { name: 'Escuela Profesional de Ingeniería Agroindustrial', value:'EPIA'},
      { name: 'Escuela Profesional de Ingeniería Ambiental', value:'EPIAM'},
      { name: 'Escuela Profesional de Administración de Empresas', value:'EPAE'},
      { name: 'Escuela Profesional de Contabilidad', value:'EPC'},
      { name: 'Escuela Profesional de Educación Primaria Intercultural', value:'EPEPI'},
    ]

    this.optionModalidad = [
      { name:'Virtual', value:'virtual'},
      { name:'Presencial', value:'presencial'},
      { name:'Semipresencial', value:'Semipresencial'},
    ]

    this.msgTooltipEmail = 'Es de suma importancia que verifique que esté correctamente escrito, para el envío de información académica';
    this.msgTooltipCel = 'Es de suma importancia que el número tenga una cuenta de WhatsApp'

    this.getListCursos();
    this.getListHorarios();

  }
  ngOnDestroy(): void {
    if(this.listCursos$) this.listCursos$.unsubscribe();
    if(this.listHorarios$) this.listHorarios$.unsubscribe();
    // this.listDepartamentos$.unsubscribe();
    // this.listProvincias$.unsubscribe();
    // this.listDistritos$.unsubscribe();
  }

  createFormEstudiante(){
    this.formEstudiante = this.fb.group({
      DNI:[null, [Validators.required,Validators.pattern(/^([0-9])*$/)]],
      Nombres:[null, [Validators.required,Validators.pattern(/^([a-z ñáéíóú]{2,60})$/i)]],
      ApellidoPaterno:[null, [Validators.required,Validators.pattern(/^([a-z ñáéíóú]{1,60})$/i)]],
      ApellidoMaterno:[null, [Validators.required,Validators.pattern(/^([a-z ñáéíóú]{1,60})$/i)]],
      FechaNacimiento:[null, [Validators.required]],
      Sexo:[null, [Validators.required]],
      Direccion:[null, Validators.required],
      Celular:[null, [Validators.pattern(/^([0-9])*$/), Validators.required]],
      Email:[null, [Validators.required,Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
      IdDepartamento:[null, [Validators.required]],
      IdProvincia:[null, [Validators.required]],
      IdDistrito:[null, [Validators.required]],
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
        Institucion:[null, Validators.required],
        EscuelaProfesional:[null],
        OtraInstitucion:[null],
    })
  }

  /** Getters */
  get DNI(){
    return this.formEstudiante.controls['DNI'];
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
  get IdDepartamento(){
    return this.formEstudiante.controls['IdDepartamento'];
  }
  get IdProvincia(){
    return this.formEstudiante.controls['IdProvincia'];
  }
  get IdDistrito(){
    return this.formEstudiante.controls['IdDistrito'];
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
  get Institucion(){
    return this.formAcademica.controls['Institucion'];
  }
  get EscuelaProfesional(){
    return this.formAcademica.controls['EscuelaProfesional'];
  }
  get OtraInstitucion(){
    return this.formAcademica.controls['OtraInstitucion'];

  }

  getListCursos(){
    this.listCursos$ = this._global.getCursosMatricula().subscribe({
      next: (resp) => {
        console.log(resp)
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
      error: (err) => {

      }
    })
  }

  completeData(estudiante:Person){
    this.formEstudiante.controls['Nombres'].setValue(estudiante.nombres);
    this.formEstudiante.controls['ApellidoPaterno'].setValue(estudiante.apellidoPaterno);
    this.formEstudiante.controls['ApellidoMaterno'].setValue(estudiante.apellidoMaterno);
  }

  Reniec(documento:string=''){
    if(documento.length==8 && this.DNI.valid){
      this.loadGetData = true;
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
        error: (err) => {
          this.loadGetData = false;
          console.log(err);
        }
      })
    }
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

  selectedDepartamento(IdPadre:number){
    this.listDistritos = [];
    this.listDistritos$ = this.listProvincias$ = this._main.getProvincias(IdPadre).subscribe({
      next: (value) => {
        this.listProvincias = value;
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  selectedProvincia(IdPadre:number){
    this._main.getDistritos(IdPadre).subscribe({
      next: (value) => {
        this.listDistritos = value;
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  validFormEstudent(){
    if(this.formEstudiante.invalid){
      Object.keys(this.formEstudiante.controls).forEach( inputName => {
        this.formEstudiante.controls[inputName].markAsDirty();
      })
      return;
    }
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
      console.log(fechaNacimiento.year())
      const edad = moment().year() - fechaNacimiento.year()
      if(edad < 18 ){
        this.EsMayor.setValue(false)
      }else{
        this.EsMayor.setValue(true)
      }
    }
  }

  ready(){
    console.log(this.formEstudiante.value);
    console.log(this.formMayorEdad.value);
    console.log(this.formCurso.value);
    console.log(this.formAcademica.value);
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

  selecOptionInstitucion(value:Institucion){
    this.selecInstitucion = value;
    if(value.code==1){
      this.EscuelaProfesional.addValidators(Validators.required);
      this.OtraInstitucion.clearValidators();
      this.OtraInstitucion.updateValueAndValidity();
      this.OtraInstitucion.markAsPristine();
    }else if(value.code==2){
      this.OtraInstitucion.addValidators(Validators.required);
      this.EscuelaProfesional.clearValidators();
      this.EscuelaProfesional.updateValueAndValidity();
      this.EscuelaProfesional.markAsPristine();
    }
  }

  selectedCurso(curso:Curso){
    this.selecCurso = curso;
  }

  selectedHorario(horario:Horario){
    this.selecHorario = horario;
  }

  toast(type:string, msg:string, detail:string=''){
    this._msg.add({severity:type, summary:msg, detail});
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
