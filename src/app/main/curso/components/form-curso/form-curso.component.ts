import { Component, OnInit, Output, EventEmitter, Input} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime, Subject } from 'rxjs';

import { MainService } from '../../../services/main.service';
import { MessageService } from 'primeng/api';
import { Pais } from '../../../class/Pais';
import { Curso } from '../../class/Curso';
import { ActivatedRoute, Router } from '@angular/router';
import { CursoService } from '../../services/curso.service';
import { optionOperation } from '../../../class/global';
import { Nivel } from '../../class/Nivel';

export interface Modulo {
  name:string,
  cantidad:number;
}

@Component({
  selector: 'app-form-curso',
  templateUrl: './form-curso.component.html',
  styleUrls: ['./form-curso.component.scss']
})
export class FormCursoComponent implements OnInit {

  /** Output and Input variables */
  @Output() dataCurso = new EventEmitter<optionOperation>();
  @Input() loading:boolean;

  /** Variables de clase */
  debouncer = new Subject();
  formCurso:FormGroup;
  paisesSugeridos:Pais  [] = [];
  niveles        :Nivel [];
  modulo         :Modulo[] = [];

  urlSelectedFlag:string | undefined;
  hayError       :boolean = false;
  isUpdate       :boolean = false;
  selectPais     :Pais | undefined;
  Id:number;
  urlLista:string;
  defaultFlag:string;

  constructor(private readonly fb:FormBuilder,
              private readonly route:Router,
              private readonly actiRouter:ActivatedRoute,
              private readonly _msg:MessageService,
              private readonly _curso:CursoService,
              private readonly _main:MainService) {
    this.niveles = [];
    this.createFormCurso();
    this.createModulos();
    this.urlLista = '/system/cursos/lista-cursos';
    this.defaultFlag = './assets/images/default-flag.png';

  }

  ngOnInit(): void {

    this.getNiveles();

    this.debouncer
      .pipe(
        debounceTime(300)
      ).subscribe({
        next:(resp) => {
          this.getPaises(resp as string);
        },
        error:(e) => console.log(e)
    })

    this.getIdByUdate(this.actiRouter);

  }

  createModulos(){
    for (let index = 1; index <= 15; index++) {
      index==1?this.modulo.push({name:`${index} Módulo`, cantidad: index}):
               this.modulo.push({name:`${index} Módulos`, cantidad: index})
    }
  }

  getNiveles(){
    this._curso.getAllNiveles().subscribe({
      next: (value) => {
        if(!value.ok){
          this.toast('error', value.msg);
          return;
        }
        this.niveles = value.data as Array<Nivel>;
      },
      error: (e) => {

      }
    })
  }

  createFormCurso(){
    this.formCurso = this.fb.group({
      NombrePais:[null,[Validators.required, Validators.pattern(/^([a-z ñáéíóú]{2,60})$/i)]],
      NombreCurso:[null,[Validators.required, Validators.pattern(/^([a-z ñáéíóú]{2,60})$/i)]],
      DescripcionCurso:[null, Validators.required],
      NumModulos:[null, Validators.required],
      nivel:[null, Validators.required],
      LinkRequisitos:[null, [Validators.pattern(/^(http:\/\/|https:\/\/|ftp:\/\/)?([a-zA-Z0-9]+([\-\.]{1}[a-zA-Z0-9]+)*\.[a-zA-Z]{2,63}(:[0-9]{1,5})?(\/.*)?)$/)]],
      UrlBandera:[null]
    })
  }

  /** getters */
  get NombrePais(){
    return this.formCurso.controls['NombrePais'];
  }
  get UrlBandera(){
    return this.formCurso.controls['UrlBandera'];
  }
  get NombreCurso(){
    return this.formCurso.controls['NombreCurso'];
  }
  get DescripcionCurso(){
    return this.formCurso.controls['DescripcionCurso'];
  }
  get nivel(){
    return this.formCurso.controls['nivel'];
  }
  get NumModulos(){
    return this.formCurso.controls['NumModulos'];
  }
  get LinkRequisitos(){
    return this.formCurso.controls['LinkRequisitos'];
  }

  teclaPresionada(){
    this.debouncer.next( this.formCurso.controls['NombrePais'].value );
  }

  getPaises(termino:string){

    if(!termino){
      this.paisesSugeridos = [];
      this.selectPais = undefined;
      this.urlSelectedFlag = undefined;
      this.UrlBandera.setValue(null);
      this.hayError = false;
      return;
    }

    this.hayError = false;

    this._main.buscarPais(termino,'name').subscribe({
      next: (resp) => {
        this.paisesSugeridos = resp.slice(0,4);
      },
      error: (e) => {
        this.hayError = true;
        setTimeout(() => this.hayError = false, 2500);
      }
    })
  }

  SelectedPais(pais:Pais){
    this.selectPais = pais;
    this.urlSelectedFlag = this.selectPais.flags.svg;
    this.NombrePais.setValue(pais.name.common);
    this.UrlBandera.setValue(pais.flags.svg);
    this.paisesSugeridos = [];
  }

  getIdByUdate(actiRouter:ActivatedRoute){
    const { id } = actiRouter.snapshot.params;
    if(!id) return;
    this.Id = id;
    this.isUpdate = true;
    this._curso.getOneCursoById(id).subscribe({
      next: (resp) => {
        this.completeDataUpdate(resp.data as Curso);
      },
      error: (e) => {
        this.route.navigate([this.urlLista]);
        this.messageError(e);
      }
    })
  }

  completeDataUpdate(curso:Curso){
    this.NombrePais.setValue(curso.NombrePais);
    this.NombreCurso.setValue(curso.NombreCurso);
    this.nivel.setValue(curso.nivel);
    this.NumModulos.setValue(curso.NumModulos);
    this.UrlBandera.setValue(curso.UrlBandera);
    this.DescripcionCurso.setValue(curso.DescripcionCurso);
    this.LinkRequisitos.setValue(curso.LinkRequisitos);
    this.urlSelectedFlag = curso.UrlBandera;
  }

  ready(){

    if(this.formCurso.invalid){
      Object.keys( this.formCurso.controls ).forEach( input => {
        this.formCurso.controls[input].markAsDirty();
      });
      return;
    }

    if(!this.urlSelectedFlag) this.UrlBandera.setValue(this.defaultFlag);

    this.dataCurso.emit({data:this.formCurso.value, option: this.isUpdate, Id:this.Id });
  }

  returnLista(){
    this.formCurso.reset();
    this.route.navigate([this.urlLista])
  }

  resetForm(){
    this.formCurso.reset();
    this.selectPais = undefined;
    this.urlSelectedFlag = undefined;
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
