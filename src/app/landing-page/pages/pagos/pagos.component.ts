import { CdkStepperNext } from '@angular/cdk/stepper';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { Button } from 'primeng/button';
import { MatStepper } from '@angular/material/stepper';
import { Curso } from 'src/app/main/curso/class/Curso';
import { EstudianteEnGrupo, ResEstudianteEnGrupo } from 'src/app/main/grupo/class/EstudianteGrupo';
import { GlobalService } from 'src/app/services/global.service';
import { Message, MessageService } from 'primeng/api';
import { switchMap } from 'rxjs';
import { Pago } from 'src/app/main/grupo/class/Pago';
import { CategoriaPago } from 'src/app/main/grupo/class/CategoriaPago';
import { Grupo } from 'src/app/main/grupo/class/Grupo';
import * as moment from 'moment';
import { MedioPago } from 'src/app/class/MedioDePago';

interface Card {
  name: string,
  code: string
}

@Component({
  selector: 'app-pagos',
  templateUrl: './pagos.component.html',
  styleUrls: ['./pagos.component.scss'],
})
export class PagosComponent {

  @ViewChild('stepper') stepper:MatStepper;
  /** Variables de clase */
  card:Card[];
  TipoDocumentoSelected:string;
  formBusqueda:FormGroup;
  formSelectGrupo:FormGroup;
  formCategoriaPago:FormGroup;
  formFile:FormGroup;
  loading:boolean;
  estudianteEnGrupo:EstudianteEnGrupo[];
  selectEstudianteGrupo:EstudianteEnGrupo;
  resEstudianteEnGrupo:ResEstudianteEnGrupo;
  cursosMatriculados:Curso;
  listCategoriaPago:CategoriaPago[];
  listMedioPago:MedioPago[] = [];
  msg: Message[] = [];
  file:File;
  formData:FormData;
  city:string;
  loadingFilePago:boolean;

  constructor(private readonly fb:FormBuilder,
              private _msg:MessageService,
              private readonly _global:GlobalService) {
    this.createFormularioBusqueda();
    this.createFormularioSelectGrupo();
    this.createFormularioFile();
    this.createFormularioCategoriaPago();
    this.inicializateVariables();
    this.getCategoriasPago();
    this.getMediosPagos();
  }

  inicializateVariables(){
    this.card = [];
    this.card = [ { name: 'DNI', code: 'DNI'}, { name: 'Carnet de extranjería', code: 'CDE' }]
    this.TipoDocumentoSelected = 'DNI';
    this.loading = false;
    this.loadingFilePago = false;
  }

  createFormularioBusqueda(){
    this.formBusqueda = this.fb.group({
      TipoDocumento:['DNI', Validators.required ],
      Documento:[null, [Validators.required, Validators.pattern(/^([0-9])*$/)]],
      IsVerifyBusqueda:[null, Validators.required ]
    })
  }

  createFormularioSelectGrupo(){
    this.formSelectGrupo = this.fb.group({
      EnGrupo:[null, Validators.required ],
      IsVerifySelectCurso:[null, Validators.required ]
    })
  }

  createFormularioCategoriaPago(){
    this.formCategoriaPago = this.fb.group({
      categoriaPago:[null, Validators.required ],
      IsVerifyCategoriaPago:[null, Validators.required ]
    })
  }

  createFormularioFile(){
    this.formFile = this.fb.group({
      FileURL:[null, Validators.required ],
      MontoPago:[null, [Validators.required, Validators.pattern(/^([0-9])*$/)]],
      NumOperacion:[null, [Validators.required, Validators.pattern(/^([0-9])*$/)]],
      FechaPago:[null, [Validators.required, Validators.pattern(/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[012])\/\d{4}$/)]],
      MedioDePago:[null, Validators.required]
    })
  }

  /** getters formulario busqueda*/
  get TipoDocumento(){
    return this.formBusqueda.controls['TipoDocumento']
  }
  get Documento(){
    return this.formBusqueda.controls['Documento']
  }
  get IsVerifyBusqueda(){
    return this.formBusqueda.controls['IsVerifyBusqueda']
  }

  /** getters formulario select curso */
  get EnGrupo(){
    return this.formSelectGrupo.controls['EnGrupo']
  }
  get IsVerifySelectCurso(){
    return this.formSelectGrupo.controls['IsVerifySelectCurso']
  }

  /** Getters formulario categoria pago */
  get categoriaPago(){
    return this.formCategoriaPago.controls['categoriaPago'];
  }
  get IsVerifyCategoriaPago(){
    return this.formCategoriaPago.controls['IsVerifyCategoriaPago'];
  }

  get FileURL(){
    return this.formFile.controls['FileURL'];
  }
  get MontoPago(){
    return this.formFile.controls['MontoPago'];
  }
  get NumOperacion(){
    return this.formFile.controls['NumOperacion'];
  }
  get FechaPago(){
    return this.formFile.controls['FechaPago'];
  }
  get MedioDePago(){
    return this.formFile.controls['MedioDePago'];
  }

  getCategoriasPago(){
    this._global.getCategoriaPago().subscribe({
      next: (value) => {
        if(value.ok){
          this.listCategoriaPago = value.data as Array<CategoriaPago>;
          return;
        }
      },
      error: (e) => {
        console.log(e)
      }
    })
  }

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

  changeCard(event:Event){
    this.TipoDocumentoSelected = this.TipoDocumento.value;
  }

  validSelectCurso(){
    /** verificar los rdio butons de los cursos */
    if(this.EnGrupo.invalid){
      this.EnGrupo.markAsDirty();
      return;
    }
    /** setear el valor de IsVerifySelectCurso en true el cual significa que eligió un grupo */
    this.IsVerifySelectCurso.setValue(true);
    /** limpiar los mensajes en pantalla */
    this._msg.clear();
    /** Seguir con el siguiente stepper */
    this.goForward();
  }

  validSelectCategoria(){
    /** verificar el radio butons de categoria de pago */
    if(this.categoriaPago.invalid){
      this.categoriaPago.markAsDirty();
      return;
    }
    /** setear el valor de IsVerifyCategoriaPago en true el cual significa que eligió una categoria de pago */
    this.IsVerifyCategoriaPago.setValue(true);
    /** mostramos valor dependiendo de el tipo de pago */
    this.selectedCategoria(this.categoriaPago.value.CodeCategoriaPago);
    console.log(this.categoriaPago.value)
    console.log(this.formSelectGrupo.value)
    /** continuar con el siguiente stepper */
    this.goForward();
  }

  search(){
    /** Validar solo el campo documento */
    if(this.Documento.invalid){
      this.Documento.markAsDirty();
      return;
    }

    /** arreglo para almacenar la lista de cursos del estudiante */
    this.estudianteEnGrupo = [];
    /** Reseteamos los formularios siguientes por si el usuarios regresa y hace la busqueda */
    this.formSelectGrupo.reset();
    this.formFile.reset();
    this.loading = true;
    /** Realizar la consulta de la persona */
    this._global.consultaEstudianteGrupo(this.formBusqueda.value).subscribe({
      next: (value) => {
        this.loading = false;
        if(value.ok){
          this.toast('success',value.msg);
          this.resEstudianteEnGrupo = value;
          this.estudianteEnGrupo = value.data as Array<EstudianteEnGrupo>;
          this.IsVerifyBusqueda.setValue(true);
          this.goForward();
          return;
        }
        this.toast('warn',value.msg);
      },
      error: (e) => {
        console.log(e)
        this.loading = false;
      }
    })

  }

  selectedCategoria(categoria:string){
    /** validamos la categoria elegida */
    const { matricula } = this.EnGrupo.value as EstudianteEnGrupo;
    const { denomiServicio } = matricula;

    if(categoria=='category_matricula'){
      const monto = denomiServicio.MontoMatricula;
      this.setValueMontoPago( monto );
      return;
    }

    if(categoria=='category_mensualidad'){
      const monto = denomiServicio.MontoPension;
      this.setValueMontoPago( monto );
      return;
    }
  }

  setValueMontoPago(monto:number){
    this.MontoPago.setValue( monto );
    this.MontoPago.disable();
    this.MontoPago.patchValue( monto );
  }

  selectFile(fileChangeEvent:any){
    this.file = fileChangeEvent.target.files[0];
    if(!this.file )return;
    this.formData = new FormData();
    this.formData.append('file', this.file, this.file.name);
    this.formData.append('id_grupo', String(this.EnGrupo.value.grupo.Id));
    this.formData.append('tipo', this.categoriaPago.value.TipoCategoriaPago);
  }

  save(){

    if(this.Documento.invalid){
      this.Documento.markAsDirty();
      return;
    }

    if(this.EnGrupo.invalid){
      this.EnGrupo.markAsDirty();
      return;
    }

    if(this.formFile.invalid){
      Object.keys( this.formFile.controls ).forEach(input => this.formFile.controls[input].markAsDirty())
      return;
    }

    this.loading = true;
    this.FileURL.disable();
    // console.log(new Pago("file.webViewLink",
    //   moment(this.FechaPago.value,'DD/MM/YYYY').toDate(),
    //   this.NumOperacion.value,
    //   this.MontoPago.value,
    //   this.categoriaPago.value,
    //   this.EnGrupo.value.Id))
    //TODO:upload file and register data width switchMap
    this._global.uploadFile(this.formData)
    .pipe(
      switchMap((file) => this._global.registerPago(new Pago(file.webViewLink,
                                                             moment(this.FechaPago.value,'DD/MM/YYYY').toDate(),
                                                             this.NumOperacion.value,
                                                             this.MontoPago.value,
                                                             this.categoriaPago.value,
                                                             this.EnGrupo.value.Id))))
      .subscribe({
        next:(value) => {
          if(value.ok){
            this.loading = false;
            this.FileURL.enable();
            this.stepper.reset();
            this.toast('success', value.msg);
          }
        },
        error:(e) => {
          this.FileURL.enable();
          this.loading = false;
          this.messageError(e);
        }
      })
  }

  goBack(){
    this.stepper.previous();
  }

  goForward(){
      this.stepper.next();
  }

  toast(severity:string, summary:string, detail?:string){
    this._msg.add({severity, summary, detail, key:'message-pagos'});
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
