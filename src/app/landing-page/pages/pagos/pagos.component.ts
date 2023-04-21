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
      MontoPago:[null, Validators.required],
      NumOperacion:[null, Validators.required],
      FechaPago:[null, Validators.required]
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

  changeCard(event:Event){
    this.TipoDocumentoSelected = this.TipoDocumento.value;
  }

  validSelectCurso(){
    if(this.EnGrupo.invalid){
      this.EnGrupo.markAsDirty();
      return;
    }
    this.IsVerifySelectCurso.setValue(true);
    this.goForward();
  }

  validSelectCategoria(){
    if(this.categoriaPago.invalid){
      this.categoriaPago.markAsDirty();
      return;
    }
    this.IsVerifyCategoriaPago.setValue(true);
    this.goForward();
  }

  search(){

    if(this.Documento.invalid){
      this.Documento.markAsDirty();
      return;
    }

    this.estudianteEnGrupo = [];
    this.formSelectGrupo.reset();
    this.formFile.reset();
    this.loading = true;
    this._global.consultaEstudianteGrupo(this.formBusqueda.value).subscribe({
      next: (value) => {
        this.loading = false;
        console.log(value)
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

  selectFile(fileChangeEvent:any){
    this.file = fileChangeEvent.target.files[0];
    if(!this.file )return;
    this.formData = new FormData();
    this.formData.append('file', this.file, this.file.name);
    this.formData.append('id_grupo', String(this.EnGrupo.value.grupo.Id));
    this.formData.append('tipo', 'mensualidad');
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
    //TODO:upload file and register data width switchMap
    this._global.uploadFile(this.formData)
    .pipe(
      switchMap((file) => this._global.registerPago(new Pago(file.webViewLink, this.EnGrupo.value.Id, '1000', 100))))
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
          console.log(e)
        }
      })
  }

  goBack(){
    this.stepper.previous();
  }

  goForward(){
      this.stepper.next();
  }

  toast(severity:string, summary:string, detail:string=''){
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
