import { Component, OnInit } from '@angular/core';
import { Curso } from '../../class/Curso';
import { ActivatedRoute, Router } from '@angular/router';
import { CursoService } from '../../services/curso.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Libro } from '../../class/Libro';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-ver-curso',
  templateUrl: './ver-curso.component.html',
  styleUrls: ['./ver-curso.component.scss']
})
export class VerCursoComponent implements OnInit {

  curso:Curso;
  idCurso:number;
  urlLista:string;
  listaLibros:Libro[] = [];
  loading:boolean = false;
  loadingSave:boolean = false;
  isUpdate:boolean = false;
  sidebarVisible:boolean = false;
  formLibro:FormGroup;
  idLibro:string;
  position:string;

  formExamen:FormGroup;
  modalCostoExamen:boolean = false;
  loadingUpdateExamen:boolean = false;

  constructor(private readonly activeRoute:ActivatedRoute,
              private readonly route:Router,
              private _msg:MessageService,
              private confirService:ConfirmationService,
              private readonly fb:FormBuilder,
              private readonly _curso:CursoService) {
    this.getIdCurso(this.activeRoute);
    this.createFormLibro();
    this.createFormExamenSuficiencia();
  }

  ngOnInit(): void {
    this.urlLista = '/system/cursos/lista-cursos';
  }

  createFormLibro(){
    this.formLibro = this.fb.group({
      TituloLibro:[null, [Validators.required]],
      CostoLibro:[null, [Validators.required, Validators.pattern(/^([0-9])+(.[0-9]+)?$/)]],
      DescripcionLibro:[null, [Validators.required, Validators.maxLength(350)]],
    })
  }

  createFormExamenSuficiencia(){
    this.formExamen = this.fb.group({
      PrecioExamSuficiencia:[null, [Validators.required, Validators.pattern(/^([0-9])+(.[0-9]+)?$/)]]
    })
  }

  /** getters */
  get TituloLibro(){
    return this.formLibro.controls['TituloLibro'];
  }
  get CostoLibro(){
    return this.formLibro.controls['CostoLibro'];
  }
  get DescripcionLibro(){
    return this.formLibro.controls['DescripcionLibro'];
  }

  get PrecioExamSuficiencia(){
    return this.formExamen.controls['PrecioExamSuficiencia'];
  }

  getIdCurso(activeRoute:ActivatedRoute){
    const { id } = activeRoute.snapshot.params;
    if(!id) return;
    this.idCurso = id;
    this.loading = true;
    this._curso.getOneCursoById(id).subscribe({
      next: (resp) => {
        this.loading = false;
        if(resp.ok){
          this.curso = resp.data as Curso;
        }
      },
      error: (e) => {
        this.loading = false;
        this.route.navigate([this.urlLista]);
        this.messageError(e);
      }
    })
  }

  addLibro(){
    this.formLibro.reset();
    this.sidebarVisible = true;
    this.isUpdate = false;
  }

  sendEditLibro(libro:Libro){
    this.sidebarVisible = true;
    this.isUpdate = true;
    this.idLibro = libro.Id;
    this._curso.getOneLibro(libro.Id).subscribe({
      next: (value) => {
        this.loadingSave = false;
        if(value.ok){
          this.completeDataLibro(value.data as Libro);
          return;
        }
      },
      error: (e) => {
        this.loadingSave = false;
        this.messageError(e);
      }
    })
  }

  save(){

    if(this.formLibro.invalid){
      Object.keys( this.formLibro.controls ).forEach( input => this.formLibro.controls[ input ].markAsDirty())
      return;
    }

    this.loadingSave = true;
    const libro = new Libro(this.TituloLibro.value, this.CostoLibro.value, this.DescripcionLibro.value, this.curso);
    this.isUpdate?this.updateLibro(this.idLibro, libro):this.registerLibro(libro);
  }

  registerLibro(libro:Libro){
    this._curso.createLibro(libro).subscribe({
      next:(value) => {
        this.loadingSave = false;
        if(value.ok){
          this.formLibro.reset();
          this.sidebarVisible = false;
          this.toast('success', value.msg);
          this.getIdCurso(this.activeRoute);
          return;
        }
      },
      error:(e) => {
        this.loadingSave = false;
        this.messageError(e);
      }
    });
  }

  openModalExamen(){
    this.modalCostoExamen = true;
  }

  updateLibro(Id:string, libro:Libro){
    if(!Id) return;
    console.log(Id)
    this._curso.updateLibro(Id, libro).subscribe({
      next: (value) => {
        if(value.ok){
          this.formLibro.reset();
          this.isUpdate = false;
          this.sidebarVisible = false;
          this.toast('success', value.msg);
          this.getIdCurso(this.activeRoute);
          return;
        }
        this.toast('warn', value.msg);
      },
      error: (e) => {
        this.messageError(e);
      }
    })
  }

  deleteLibro(Id:string){
    this._curso.deleteLibro(Id).subscribe({
      next: (value) => {
        if(value.ok){
          this.toast('success', value.msg);
          return;
        }
        this.toast('warn', value.msg);
      },
      error: (e) => {
        this.messageError(e);
      }
    })
  }

  dialogDeleteLibro({TituloLibro, Id}:Libro) {
    this.position = 'top';
    this.confirService.confirm({
        message: `¿Está seguro de eliminar el libro <b>${TituloLibro}</b>?`,
        header: 'Confirmación de eliminar',
        icon: 'pi pi-info-circle',
        accept: () => {
          this.deleteLibro(Id);
        },
        reject: (type:any) => {
          console.log("No eliminar");
        },
        key: "deleteUsuarioDialog"
    });
  }

  updateMontoExamen(){
    if(this.formExamen.invalid){
      Object.keys( this.formExamen.controls ).forEach( label => this.formExamen.controls[ label ].markAsDirty());
      return;
    }
    this._curso.updateCurso(this.idCurso,{ PrecioExamSuficiencia: this.PrecioExamSuficiencia.value } as Curso).subscribe({
      next:(resp) => {
        if(resp.ok){
          // updated variables
          this.curso.PrecioExamSuficiencia = this.PrecioExamSuficiencia.value;
          this.toast('success', resp.msg, 'Actualización del precio del exámen del curso')
          return;
        }
        this.toast('warn', resp.msg,'Error actualización del precio del exámen del curso');
      },
      error:(e) => {
        this.messageError(e)
      },
    })
    console.log(this.formExamen.value)
  }

  completeDataLibro(libro:Libro){
    this.TituloLibro.setValue(libro.TituloLibro);
    this.CostoLibro.setValue(libro.CostoLibro);
    this.DescripcionLibro.setValue(libro.DescripcionLibro);
  }

  countLibros(libros:Libro[]){
    return libros.filter( libro => libro.Estado== true ).length;
  }

  toast(type:string, msg:string, detail:string=''){
    this._msg.add({severity:type, summary:msg, detail});
  }

  messageError(e:any){
    const msg = e.error.message;
    Array.isArray(msg)?msg.forEach( (e:string) => this.toast('error', e, 'Error de validación de datos')):
                                                  this.toast('error', msg,`${e.error.error}:${e.error.statusCode}`)
  }

}
