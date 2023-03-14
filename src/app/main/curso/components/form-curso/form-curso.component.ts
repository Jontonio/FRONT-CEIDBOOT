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

export interface Nivel {
  name:string,
  code:string;
}

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

  @Output() dataCurso = new EventEmitter<optionOperation>();
  @Input() loadding:boolean;

  formCurso:FormGroup;
  debouncer = new Subject();
  nivel          :Nivel [] = [];
  modulo         :Modulo[] = [];
  paisesSugeridos:Pais  [] = [];
  hayError       :boolean = false;
  isUpdate       :boolean = false;
  selectPais     :Pais | undefined;
  urlSelectedFlag:string | undefined;
  Id:number;
  urlLista:string = '/system/cursos/lista-cursos'

  constructor(private fb:FormBuilder,
              private route:Router,
              private actiRouter:ActivatedRoute,
              private _msg:MessageService,
              private _curso:CursoService,
              private _main:MainService) {

    this.createFormCurso();

    this.nivel = [
      {name: 'Básico', code: 'Básico'},
      {name: 'Intermedio', code: 'Intermedio'},
      {name: 'Avanzado', code: 'Avanzado'},
    ];

    for (let index = 1; index <= 15; index++) {
        if(index==1){
          this.modulo.push({name:`${index} Módulo`, cantidad: index})
        }else{
          this.modulo.push({name:`${index} Módulos`, cantidad: index})
        }
    }

  }

  createFormCurso(){
    this.formCurso = this.fb.group({
      NombrePais:[null,[Validators.required, Validators.pattern(/^([a-z ñáéíóú]{2,60})$/i)]],
      UrlBandera:[null, [Validators.required]],
      NombreCurso:[null,[Validators.required, Validators.pattern(/^([a-z ñáéíóú]{2,60})$/i)]],
      DescripcionCurso:[null,[Validators.required]],
      NivelCurso:[null, [Validators.required]],
      NumModulos:[null, [Validators.required]]
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
  get NivelCurso(){
    return this.formCurso.controls['NivelCurso'];
  }
  get NumModulos(){
    return this.formCurso.controls['NumModulos'];
  }

  ngOnInit(): void {

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

  teclaPresionada(){
    this.debouncer.next( this.formCurso.controls['NombrePais'].value );
  }

  getPaises(termino:string){

    if(!termino){
      this.paisesSugeridos = [];
      this.selectPais = undefined;
      this.urlSelectedFlag = undefined;
      this.UrlBandera.setValue(null);
      return;
    }

    this.hayError = false;

    this._main.buscarPais(termino,'name').subscribe({
      next: (resp) => {
        this.paisesSugeridos = resp.slice(0,4);
      },
      error: (e) => {
        this.hayError = true;
        console.log(e);
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
    this.NivelCurso.setValue(curso.NivelCurso);
    this.NumModulos.setValue(curso.NumModulos);
    this.UrlBandera.setValue(curso.UrlBandera);
    this.DescripcionCurso.setValue(curso.DescripcionCurso);
    this.urlSelectedFlag = curso.UrlBandera;
  }

  ready(){

    if(this.formCurso.invalid){

      Object.keys( this.formCurso.controls ).forEach( input => {
        this.formCurso.controls[input].markAsDirty();
      });

      return;
    }

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

  messageError(e:any){
    if(Array.isArray(e.error.message)){
      e.error.message.forEach( (e:string) => {
        this.toast('error',e,'Error de validación de datos')
      })
    }else{
      this.toast('error',e.error.message,`${e.error.error}:${e.error.statusCode}`)
    }
  }

  toast(type:string, msg:string, detail:string=''){
    this._msg.add({severity:type, summary:msg, detail});
  }

}
