import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Person } from 'src/app/class/Person';
import { MainService } from 'src/app/main/services/main.service';
import { GlobalService } from 'src/app/services/global.service';
import { Departamento, Distrito, Provincia } from 'src/app/main/class/Ubigeo';
import { Subscription } from 'rxjs';
import { Edad, Escuela, Institucion, Modalidad, Sexo } from '../../main/matricula/interfaces/global';

@Component({
  selector: 'app-form-matricula',
  templateUrl: './form-matricula.component.html',
  styleUrls: ['./form-matricula.component.scss']
})
export class FormMatriculaComponent implements OnInit {

  isUpdate:boolean       = false;
  loadGetData:boolean    = false;
  displayMayoria:boolean = false;
  estudiaUnajma:boolean = false;

  formEstudiante:FormGroup;
  optionSexo:Sexo[];
  optionEdad:Edad[];
  optionInstitucion:Institucion[];
  optionEscuelas:Escuela[];
  optionModalidad:Modalidad[];

  listDepartamentos$:Subscription;
  listProvincias$:Subscription;
  listDistritos$:Subscription;

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
                this.getDepartamentos();
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

  }
  ngOnDestroy(): void {
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
      EsMenor:[null, [Validators.required]],
      DNIApoderado:[null, [Validators.required,Validators.pattern(/^([0-9])*$/)]],
      NomApoderado:[null, [Validators.required,Validators.pattern(/^([a-z ñáéíóú]{2,60})$/i)]],
      ApellidoPApoderado:[null, [Validators.required,Validators.pattern(/^([a-z ñáéíóú]{1,60})$/i)]],
      ApellidoMApoderado:[null, [Validators.required,Validators.pattern(/^([a-z ñáéíóú]{1,60})$/i)]],
      CelApoderado:[null, [Validators.pattern(/^([0-9])*$/), Validators.required]],
      Curso:[null, Validators.required],
      Modalidad:[null, Validators.required],
      Horario:[null, Validators.required],
      Poblacion:[null, Validators.required],
      Institucion:[null, Validators.required],
      EscuelaProfesional:[null, Validators.required],
      OtraInstitucion:[null, Validators.required],
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
  get EsMenor(){
    return this.formEstudiante.controls['EsMenor'];
  }
  get DNIApoderado(){
    return this.formEstudiante.controls['DNIApoderado'];
  }
  get NomApoderado(){
    return this.formEstudiante.controls['NomApoderado'];
  }
  get ApellidoPApoderado(){
    return this.formEstudiante.controls['ApellidoPApoderado'];
  }
  get ApellidoMApoderado(){
    return this.formEstudiante.controls['ApellidoMApoderado'];
  }
  get CelApoderado(){
    return this.formEstudiante.controls['CelApoderado'];
  }
  get Curso(){
    return this.formEstudiante.controls['Curso'];
  }
  get Modalidad(){
    return this.formEstudiante.controls['Modalidad'];
  }
  get Horario(){
    return this.formEstudiante.controls['Horario'];
  }
  get Poblacion(){
    return this.formEstudiante.controls['Poblacion'];
  }
  get Institucion(){
    return this.formEstudiante.controls['Institucion'];
  }
  get EscuelaProfesional(){
    return this.formEstudiante.controls['EscuelaProfesional'];
  }
  get OtraInstitucion(){
    return this.formEstudiante.controls['OtraInstitucion'];

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

  ready(){

    if(this.formEstudiante.invalid){
      Object.keys(this.formEstudiante.controls).forEach( inputName => {
        this.formEstudiante.controls[inputName].markAsDirty();
      })
      return;
    }

    console.log(this.formEstudiante.value);

  }

  selecOptionEdad(value:boolean){
    if(!value){
      this.displayMayoria = true;
    }else{
      this.displayMayoria = false;
    }
  }

  selecOptionInstitucion(value:Institucion){
    this.selecInstitucion = value;
    console.log(value)
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
