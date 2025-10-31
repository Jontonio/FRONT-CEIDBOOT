import { CdkStepperNext } from '@angular/cdk/stepper';
import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { Curso } from 'src/app/main/curso/class/Curso';
import { GlobalService } from 'src/app/services/global.service';
import { Message, MessageService } from 'primeng/api';
import { switchMap } from 'rxjs';
import { Pago } from 'src/app/main/grupo/class/Pago';
import { CategoriaPago } from 'src/app/main/grupo/class/CategoriaPago';
import * as moment from 'moment';
import { MedioPago } from 'src/app/class/MedioDePago';
import { GrupoModulo } from 'src/app/main/grupo/class/GrupoModulo';
import { EstudianteEnGrupo, ResEstudianteEnGrupo } from 'src/app/main/grupo/class/EstudianteGrupo';

interface Card {
  name: string,
  code: string
}

interface SetPrecio{
  monto:number | null;
  mensaje:string;
  visibleInput:boolean;
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
  formBusqueda:UntypedFormGroup;
  formSelectGrupoCategoria:UntypedFormGroup;
  formFile:UntypedFormGroup;
  loading:boolean;
  ListEstudianteEnGrupo:EstudianteEnGrupo[];
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
  selectedGrupo:EstudianteEnGrupo;
  selectedModulo:GrupoModulo;
  listModulogrupo:GrupoModulo[] = [];
  selectedCategory:CategoriaPago;
  isPagoMensualidad:boolean;
  setPrecio:SetPrecio;
  currentModulo:GrupoModulo | null;

  constructor(private readonly fb:UntypedFormBuilder,
              private _msg:MessageService,
              private readonly _global:GlobalService) {
    this.createFormularioBusqueda();
    this.createFormularioSelectGrupo();
    this.createFormularioFile();
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
    this.isPagoMensualidad = false;
  }

  createFormularioBusqueda(){
    this.formBusqueda = this.fb.group({
      TipoDocumento:['DNI', Validators.required ],
      Documento:[null, [Validators.required, Validators.pattern(/^([0-9])*$/)]],
      IsVerifyBusqueda:[null, Validators.required ]
    })
  }

  createFormularioSelectGrupo(){
    this.formSelectGrupoCategoria = this.fb.group({
      estudianteEnGrupo:[null, Validators.required ],
      categoriaPago:[null, Validators.required ],
      grupoModulo:[null, Validators.required],
      IsVerifySelectCurso:[null, Validators.required ]
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
  get estudianteEnGrupo(){
    return this.formSelectGrupoCategoria.controls['estudianteEnGrupo']
  }
  get IsVerifySelectCurso(){
    return this.formSelectGrupoCategoria.controls['IsVerifySelectCurso']
  }
  get categoriaPago(){
    return this.formSelectGrupoCategoria.controls['categoriaPago'];
  }
  get grupoModulo(){
    return this.formSelectGrupoCategoria.controls['grupoModulo'];
  }

  /** Getters formulario categoria pago */
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
    this.Documento.reset();
  }

  validSelectCursoGrupo(){
    /** verificar los rdio butons de los cursos */
    if(this.estudianteEnGrupo.invalid || this.categoriaPago.invalid || this.grupoModulo.invalid){
      this.estudianteEnGrupo.markAsDirty();
      this.categoriaPago.markAsDirty();
      this.grupoModulo.markAsDirty();
      return;
    }
    /** setear precios */
    this.setearPrecios(this.selectedCategory);
    /** setear el valor de IsVerifySelectCurso en true el cual significa que eligió un grupo */
    this.IsVerifySelectCurso.setValue(true);
    /** limpiar los mensajes en pantalla */
    this._msg.clear();
    /** Seguir con el siguiente stepper */
    this.goForward();
  }

  setearPrecios(categoria:CategoriaPago){

    if(categoria.CodeCategoriaPago=='category_mensualidad'){
      const monto = this.selectedGrupo.matricula.denomiServicio.MontoPension;
      this.MontoPago.setValue(monto);
      this.setPrecio = {
        mensaje:'cargue su voucher de monto ',
        monto: monto,
        visibleInput:false
      }
      return;
    }

    if(categoria.CodeCategoriaPago=='category_matricula'){
      const monto = this.selectedGrupo.matricula.denomiServicio.MontoMatricula;
      this.MontoPago.setValue(monto);
      this.setPrecio = {
        mensaje:'cargue su voucher de monto ',
        monto: monto,
        visibleInput:false
      }
      return;
    }

    if(categoria.CodeCategoriaPago=='category_libro'){
      this.MontoPago.setValue(0.0);
      this.setPrecio = {
        mensaje:'Para más información del precio del libro comuniquese con del CEID',
        monto: 0.0,
        visibleInput:false
      }
      return;
    }

    if(categoria.CodeCategoriaPago=='category_extemporaneo'){
      this.MontoPago.setValue(null); // va depender del grupo
      // agregar validaciones
      this.addValidatorsMontoPago();
      this.setPrecio = {
        mensaje:'Cargue su voucher de pago',
        monto: null,
        visibleInput:true
      }
      return;
    }

    this.MontoPago.setValue( 0.0 );
      this.setPrecio = {
        mensaje:'Para más información del precio comuniquese con del CEID',
        monto: 0.0,
        visibleInput:false
    }

    this.clearValidatorsMontoPago();

  }

  clearValidatorsMontoPago(){
    this.MontoPago.clearValidators();
    this.MontoPago.updateValueAndValidity();
    this.MontoPago.markAsPristine();
  }
  addValidatorsMontoPago(){
    this.MontoPago.addValidators([Validators.required]);
  }

  search(){
    /** Validar solo el campo documento */
    if(this.Documento.invalid){
      this.Documento.markAsDirty();
      return;
    }
    /** arreglo para almacenar la lista de cursos del estudiante */
    this.ListEstudianteEnGrupo = [];
    /** limpiar mensajes anteriores */
    this._msg.clear();
    /** Reseteamos los formularios siguientes por si el usuarios regresa y hace la busqueda */
    this.formSelectGrupoCategoria.reset();
    this.formFile.reset();
    this.loading = true;
    /** Realizar la consulta de la persona */
    this._global.consultaEstudianteGrupo(this.formBusqueda.value).subscribe({
      next: (value) => {
        this.loading = false;
        if(value.ok){
          this.toast('success',value.msg);
          this.resEstudianteEnGrupo = value;
          this.ListEstudianteEnGrupo = value.data as Array<EstudianteEnGrupo>;
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

  selectOneGrupo(data:EstudianteEnGrupo){
    if(!data) return;
    this.selectedGrupo = data;
    this.listModulogrupo = this.selectedGrupo.grupo.grupoModulo;
    const current = this.listModulogrupo.filter( gModulo => gModulo.CurrentModulo == true )
    this.currentModulo = current?current[0]:null;
  }

  selectModulo(data:GrupoModulo){
    this.selectedModulo = data;
  }

  selectedCategoria(categoria:string){
    /** validamos la categoria elegida */
    if(categoria=='category_mensualidad' || categoria=='category_extemporaneo'){
      this.addValidatorsGrupoModulo();
      this.isPagoMensualidad = true;
    }else{
      this.clearValidatorsGrupoModulo();
      this.isPagoMensualidad = false;
    }

  }

  selectedCategories(categoria:CategoriaPago){
    this.grupoModulo.reset();
    if(!categoria) return;
    this.selectedCategory = categoria;
    this.selectedCategoria(categoria.CodeCategoriaPago);
  }

  setValueMontoPago(monto:number){
    this.MontoPago.setValue( monto );
    this.MontoPago.disable();
    this.MontoPago.patchValue( monto );
  }

  addValidatorsGrupoModulo(){
    this.grupoModulo.addValidators([ Validators.required ]);
    // this.MontoPago.addValidators([ Validators.required ]);
  }

  clearValidatorsGrupoModulo(){
    this.grupoModulo.clearValidators();
    this.grupoModulo.updateValueAndValidity();
    this.grupoModulo.markAsPristine();

    // this.MontoPago.clearValidators();
    // this.MontoPago.updateValueAndValidity();
    // this.MontoPago.markAsPristine();
  }

  selectFile(fileChangeEvent:any){
    this.file = fileChangeEvent.target.files[0];
    if(!this.file )return;
    // Verificar el tamaño del archivo
    const fileSizeInMB = this.file.size / (1024 * 1024);
    if (fileSizeInMB > 4) {
      // El archivo excede el tamaño permitido
      // Mostrar un mensaje de error o realizar alguna acción adecuada
      this.toast('warn',`El tamaño del archivo excede 4 MB`);
      this.FileURL.reset();
      return;
    }

    // Verificar el formato del archivo
    const allowedFormats = ['image/png', 'image/jpeg', 'application/pdf'];
    if (!allowedFormats.includes(this.file.type)) {
      // El formato del archivo no es permitido
      // Mostrar un mensaje de error o realizar alguna acción adecuada
      this.toast('warn',`El formato del archivo no es permitido`);
      this.FileURL.reset();
      return;
    }

    this.formData = new FormData();
    this.formData.append('file', this.file, this.file.name);
    this.formData.append('id_grupo', String(this.estudianteEnGrupo.value.grupo.Id));
    this.formData.append('tipo', this.categoriaPago.value.TipoCategoriaPago);
  }

  save(){
    if(this.formFile.invalid){
      Object.keys( this.formFile.controls ).forEach(input => this.formFile.controls[input].markAsDirty())
      return;
    }

    this.loading = true;
    this.FileURL.disable();
    const pago = new Pago(this.FileURL.value,
                          moment(this.FechaPago.value).toDate(),
                          this.NumOperacion.value,
                          this.MontoPago.value,
                          {Id: this.MedioDePago.value.Id} as MedioPago,
                          {Id: this.categoriaPago.value.Id} as CategoriaPago,
                          {Id: this.estudianteEnGrupo.value.Id} as EstudianteEnGrupo,
                          this.grupoModulo.value);
    //TODO:upload file and register data width switchMap
    this._global.uploadFile(this.formData)
    .pipe(
      switchMap((file) => this._global.registerPago( new Pago(file.webViewLink,
                                                              moment(this.FechaPago.value,'DD/MM/YYYY').toDate(),
                                                              this.NumOperacion.value,
                                                              this.MontoPago.value,
                                                              {Id: this.MedioDePago.value.Id} as MedioPago,
                                                              {Id: this.categoriaPago.value.Id} as CategoriaPago,
                                                              {Id: this.estudianteEnGrupo.value.Id} as EstudianteEnGrupo,
                                                              this.grupoModulo.value))))
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
