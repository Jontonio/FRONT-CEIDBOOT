import { Component, OnInit, Output, EventEmitter, Input} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime, Subject } from 'rxjs';

import { MainService } from '../../services/main.service';
import { MessageService } from 'primeng/api';
import { Pais } from '../../class/Pais';
import { Curso } from '../../class/Curso';

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

  @Output() dataCurso = new EventEmitter<Curso>();
  @Input() loadding:boolean;

  formCurso:FormGroup;
  debouncer = new Subject();
  nivel          :Nivel [] = [];
  modulo         :Modulo[] = [];
  paisesSugeridos:Pais  [] = [];
  hayError       :boolean = false;
  selectPais     :Pais | undefined;


  constructor(private fb:FormBuilder,
              private _msg:MessageService,
              private _main:MainService) {

    this.createFormCurso();

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

    this.nivel = [
      {name: 'Básico', code: 'Básico'},
      {name: 'Intermedio', code: 'Intermedio'},
      {name: 'Avanzado', code: 'Avanzado'},
    ];

    for (let index = 1; index <= 10; index++) {
        if(index==1){
          this.modulo.push({name:`${index} Módulo`, cantidad: index})
        }else{
          this.modulo.push({name:`${index} Módulos`, cantidad: index})
        }
    }

    this.debouncer
      .pipe(
        debounceTime(300)
      ).subscribe({
        next:(resp) => {
          this.getPaises(resp as string);
        },
        error:(e) => console.log(e)
    })

  }

  teclaPresionada(){
    this.debouncer.next( this.formCurso.controls['NombrePais'].value );
  }

  getPaises(termino:string){

    if(!termino){
      this.paisesSugeridos = [];
      this.selectPais = undefined;
      this.UrlBandera.setValue(null);
      return;
    }

    this.hayError = false;

    this._main.buscarPais(termino,'name').then( resp => {
      this.paisesSugeridos = resp.slice(0,4);
    }).catch( error => {
      this.hayError = true;
      console.log(error);
    })

  }

  SelectedPais(pais:Pais){
    this.selectPais = pais;
    this.NombrePais.setValue(pais.name.common);
    this.UrlBandera.setValue(pais.flags.svg);
    this.paisesSugeridos = [];
  }

  ready(){

    if(this.formCurso.invalid){

      Object.keys( this.formCurso.controls ).forEach( input => {
        this.formCurso.controls[input].markAsDirty();
      });

      return;
    }

    this.dataCurso.emit(this.formCurso.value);

  }

  reset(){

    this.formCurso.reset();
    this.paisesSugeridos = [];
    this.selectPais = undefined;

  }

  toast(type:string, msg:string, detail:string=''){
    this._msg.add({severity:type, summary:msg, detail});
  }

}
