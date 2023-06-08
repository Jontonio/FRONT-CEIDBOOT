import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GrupoService } from '../../services/grupo.service';
import { MessageService } from 'primeng/api';
import { EstudianteEnGrupo } from '../../class/EstudianteGrupo';
import { Estudiante } from 'src/app/main/matricula/class/Estudiante';
import { Apoderado } from 'src/app/main/matricula/class/Apoderado';
import { Matricula } from 'src/app/main/matricula/class/Matricula';
import { DenominServicio } from 'src/app/denomin-servicio/class/Denomin-servicio';
import { Subscription, switchMap } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Code } from '../../class/Code';
import { MatriculaService } from 'src/app/main/matricula/services/matricula.service';
import { GlobalService } from 'src/app/services/global.service';
import { MainService } from 'src/app/main/services/main.service';
import { ShowFileComponent } from 'src/app/shared/show-file/show-file.component';

interface Card {
  name: string,
  code: string
}

@Component({
  selector: 'app-info-estudiante',
  templateUrl: './info-estudiante.component.html',
  styleUrls: ['./info-estudiante.component.scss']
})
export class InfoEstudianteComponent {

  @ViewChild(ShowFileComponent) showFileComponent:ShowFileComponent;

  idEstudiante:number;
  idGrupo: string;

  matriculaEstudiante:EstudianteEnGrupo;
  listDenominServicio:DenominServicio[];
  listDenominServicio$:Subscription;
  hayErrorGetData:boolean = false;
  loadingUpdate:boolean = false;

  formEstudiante:FormGroup;
  formApoderado:FormGroup;
  card:Card[] = [];
  TipoDocumentoSelected:string;
  apoderado:Apoderado;

  country:Code;
  countryApoderado:Code;
  isPeru:boolean;

  /** file documento */
  loadingDocumento:boolean = false;
  formFile:FormGroup;
  fileURL:string;

  constructor(private activeRouter:ActivatedRoute,
              private readonly fb:FormBuilder,
              private _grupo:GrupoService,
              private _main:MainService,
              private readonly _matricula:MatriculaService,
              private readonly _global:GlobalService,
              private _msg:MessageService) {
    this.country = { name:'Peru', codePhone:'+51', flag:'https://flagcdn.com/pe.svg', code:'PE'};
    this.isPeru = true;
    this.createFormEstudiante();
    this.createFormApoderado();
    this.getListaDenominacionServicio();
    this.createFormFile();
    this.getIds(this.activeRouter);
  }

  getIds(activeRoute:ActivatedRoute){
    const { idEstudiante, idGrupo } = activeRoute.snapshot.params;
    this.idEstudiante = idEstudiante;
    this.idGrupo = idGrupo;
    this.getDataEstudiante(idEstudiante, idGrupo)
  }

  getDataEstudiante(idEstudiante:string, igGrupo:string){
    this._grupo.getEstudianteEnGrupoEspecificoById(igGrupo, idEstudiante).subscribe({
      next:(value) => {
        if(value.ok){
          this.matriculaEstudiante = value.data as EstudianteEnGrupo;
          this.completeDataUpdate(this.matriculaEstudiante);
          return;
        }
      },
      error:(e) => {
        this.messageError(e);
      }
    })
  }

  ngOnInit(): void {
    this.country = { name:'Peru', codePhone:'+51', flag:'https://flagcdn.com/pe.svg', code:'PE'};
    this.countryApoderado = { name:'Peru', codePhone:'+51', flag:'https://flagcdn.com/pe.svg', code:'PE'};

    this.card = [
      {name: 'DNI', code: 'DNI'},
      {name: 'Carnet de extranjería', code: 'CDE' }
    ];
    this.TipoDocumento.setValue('DNI');
  }

  completeDataUpdate(estudianteEnGrupo:EstudianteEnGrupo){
    /** General información estudiante */
    this.Celular.setValue(estudianteEnGrupo.estudiante.Celular);
    this.Email.setValue(estudianteEnGrupo.estudiante.Email);
    this.denomiServicio.setValue(estudianteEnGrupo.matricula.denomiServicio);
    this.CodeEstudiante.setValue(estudianteEnGrupo.estudiante.Code);
    this.CodePhoneEstudiante.setValue(estudianteEnGrupo.estudiante.CodePhone);
    this._main.getOneCountryByCode(estudianteEnGrupo.estudiante.Code).subscribe({
      next: (resp) => {
        if(resp.length!=0){
          this.country = resp[0];
        }
      },
      error: (e) => {
        console.log(e)
      }
    });

    if(estudianteEnGrupo.estudiante.apoderado){
      this.apoderado = estudianteEnGrupo.estudiante.apoderado;
      /** Complete datos del apoderado si existe */
      this.TipoDocumento.setValue(this.apoderado.TipoDocumento)
      this.DocumentoApoderado.setValue(this.apoderado.Documento)
      this.NomApoderado.setValue(this.apoderado.NomApoderado)
      this.ApellidoPApoderado.setValue(this.apoderado.ApellidoPApoderado)
      this.ApellidoMApoderado.setValue(this.apoderado.ApellidoMApoderado)
      this.CelApoderado.setValue(this.apoderado.CelApoderado)
      this.CodeApoderado.setValue(this.apoderado.Code);
      this.CodePhoneApoderado.setValue(this.apoderado.CodePhone);
      this._main.getOneCountryByCode(this.apoderado.Code).subscribe({
        next: (resp) => {
          if(resp.length!=0){
            this.countryApoderado = resp[0];
          }
        },
        error: (e) => {
          console.log(e)
        }
      });
    }
  }

  getListaDenominacionServicio(){
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

  createFormEstudiante(){
    this.formEstudiante = this.fb.group({
      Celular:[null, [Validators.pattern(/^([0-9])*$/), Validators.required]],
      Email:[null, [Validators.required,Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
      denomiServicio:[null],
      Code:[null, Validators.required],
      CodePhone:[null, Validators.required]
    })
  }

  createFormFile(){
    this.formFile = this.fb.group({
      FileDocumento:[null, Validators.required ],
      FileDataDocumento:[null, Validators.required ],
    })
  }

  createFormApoderado(){
    this.formApoderado = this.fb.group({
      TipoDocumento:[null, Validators.required],
      Documento:[null, [Validators.required, Validators.pattern(/^([0-9])*$/)]],
      NomApoderado:[null, [Validators.required,Validators.pattern(/^([a-z ñáéíóú]{2,60})$/i)]],
      ApellidoPApoderado:[null, [Validators.required,Validators.pattern(/^([a-z ñáéíóú]{2,60})$/i)]],
      ApellidoMApoderado:[null, [Validators.required,Validators.pattern(/^([a-z ñáéíóú]{2,60})$/i)]],
      CelApoderado:[null, [Validators.pattern(/^([0-9])*$/), Validators.required]],
      Code:[null, Validators.required],
      CodePhone:[null, Validators.required]
    })
  }

  get Celular(){
    return this.formEstudiante.controls['Celular']
  }
  get Email(){
    return this.formEstudiante.controls['Email']
  }

  get CodeEstudiante(){
    return this.formEstudiante.controls['Code'];
  }
  get CodePhoneEstudiante(){
    return this.formEstudiante.controls['CodePhone'];
  }

  get denomiServicio(){
    return this.formEstudiante.controls['denomiServicio'];
  }

  get TipoDocumento(){
    return this.formApoderado.controls['TipoDocumento'];
  }
  get DocumentoApoderado(){
    return this.formApoderado.controls['Documento'];
  }
  get NomApoderado(){
    return this.formApoderado.controls['NomApoderado'];
  }
  get ApellidoPApoderado(){
    return this.formApoderado.controls['ApellidoPApoderado'];
  }
  get ApellidoMApoderado(){
    return this.formApoderado.controls['ApellidoMApoderado'];
  }
  get CelApoderado(){
    return this.formApoderado.controls['CelApoderado'];
  }
  get CodeApoderado(){
    return this.formApoderado.controls['Code'];
  }
  get CodePhoneApoderado(){
    return this.formApoderado.controls['CodePhone'];
  }

  get FileDataDocumento(){
    return this.formFile.controls['FileDataDocumento'];
  }
  get FileDocumento(){
    return this.formFile.controls['FileDocumento'];
  }

  selectedCountry(country:Code){
    this.country = country;
    this.isPeru = (this.country.code!='PE')?false:true;
    this.CodeEstudiante.setValue(this.country.code);
    this.CodePhoneEstudiante.setValue(this.country.codePhone);
    /** cambiar si existe apoderado */
    if(this.apoderado){
      this.CodeApoderado.setValue(country.code);
      this.CodePhoneApoderado.setValue(country.codePhone);
    }
  }

  selectedCountryApoderado(country:Code){
    this.countryApoderado = country;
    this.isPeru = (this.country.code!='PE')?false:true;
    /** cambiar si existe apoderado */
    if(this.apoderado){
      this.CodeApoderado.setValue(this.countryApoderado.code);
      this.CodePhoneApoderado.setValue(this.countryApoderado.codePhone);
    }
  }


  selectServicio(servicio:DenominServicio){
    if(!servicio) return;
  }

  changeCard(event:string){
    this.TipoDocumentoSelected = this.TipoDocumento.value;
  }

  updateDatos(){
    if(this.formEstudiante.invalid){
      Object.keys( this.formEstudiante.controls ).forEach( label => this.formEstudiante.controls[label].markAsDirty())
      return;
    }
    this.loadingUpdate = true;
    this._matricula.updateMatricula(this.matriculaEstudiante.Id, { denomiServicio: this.denomiServicio.value } as Matricula)
        .pipe(
          switchMap((res) =>
          this._matricula.updateEstudiante(this.matriculaEstudiante.estudiante.Id, { Code:this.country.code, CodePhone:this.country.codePhone, Celular:this.Celular.value, Email:this.Email.value } as Estudiante))
        )
        .subscribe({
          next:(value) => {
            this.loadingUpdate = false;
            this.toast('success','Actualización de datos','Datos del estudiante actualizados correctamente');
            this.getIds(this.activeRouter);
          },
          error:(e) => {
            this.loadingUpdate = false;
            this.messageError(e);
          }
        })
  }

  saveApoderado(){

    this.CodeApoderado.setValue(this.countryApoderado.code);
    this.CodePhoneApoderado.setValue(this.countryApoderado.codePhone);

    if(this.formApoderado.invalid){
      Object.keys( this.formApoderado.controls ).forEach( label => this.formApoderado.controls[ label ].markAsDirty() )
      return;
    }

    this._grupo.updateApoderadoEstudiante(this.idEstudiante, {Id:this.idEstudiante, apoderado:this.formApoderado.value} as Estudiante).subscribe({
      next:(resp) => {
        if(resp.ok){
          this.toast('success', resp.msg);
          this.getIds(this.activeRouter);
        }
      },
      error:(e) => {
        this.messageError(e);
      }
    })
    console.log(this.formApoderado.value)
  }

  toast(severity:string, summary:string, detail:string=''){
    this._msg.add({severity, summary, detail});
  }

  onDocumentoChange(fileChangeEvent:any) {
    const file = fileChangeEvent.target.files[0];
    if( !file )return;
    // Verificar el tamaño del archivo
    const fileSizeInMB = file.size / (1024 * 1024);
    if (fileSizeInMB > 4) {
      // El archivo excede el tamaño permitido
      // Mostrar un mensaje de error o realizar alguna acción adecuada
      this.toast('warn',`El tamaño del archivo excede 4 MB`);
      this.formFile.reset();
      return;
    }

    // Verificar el formato del archivo
    const allowedFormats = ['application/pdf'];
    if (!allowedFormats.includes(file.type)) {
      // El formato del archivo no es permitido
      // Mostrar un mensaje de error o realizar alguna acción adecuada
      this.toast('warn',`El formato del archivo no es permitido`);
      this.formFile.reset();
      return;
    }

    this.loadingDocumento = true;
    this.FileDocumento.disable();
    const direccion = 'requisitos';
    let formData = new FormData();
    formData.append('file', file, file.name);
    formData.append('id_grupo', String(this.idGrupo));
    formData.append('tipo', direccion);
    this._global.uploadFile(formData).subscribe({
      next: (value) => {
        this.loadingDocumento = false;
        this.FileDocumento.enable();
        this.FileDataDocumento.setValue(value);
      },
      error: (e) => {
        this.FileDocumento.enable();
        this.FileDataDocumento.setValue(null);
        this.loadingDocumento = false;
        this.messageError(e,`Vuelve a intentar con la carga ${direccion} de matrícula`);
      },
    })
  }

  onSubmitDocumento(){

    if(this.formFile.invalid){
      Object.keys( this.formFile.controls ).forEach( label => this.formFile.controls[ label ].markAsDirty() )
      return;
    }
    const data =  { FileMatriculaURL: this.FileDataDocumento.value.webViewLink } as Matricula;
    this._matricula.updateMatricula(this.matriculaEstudiante.matricula.Id, data)
        .subscribe({
          next:(resp) => {
            if(resp.ok){
              this.toast('success', resp.msg,'Documentos actualizados');
              this.getIds(this.activeRouter);
            }
            this.formFile.reset();
          },
          error:(e) => {
            this.messageError(e);
          }
        })
  }

  showFile(){
    this.showFileComponent.showModal();
    this.showFileComponent.showSpinner();
    this.fileURL = this.matriculaEstudiante.matricula.FileMatriculaURL;
  }

  messageError(e:any, detail:string = 'Error de validación de datos'){
    if(Array.isArray(e.error.message)){
      e.error.message.forEach( (e:string) => {
        this.toast('error', e, detail)
      })
    }else{
      this.toast('error',e.error.message, detail);
    }
  }

}
