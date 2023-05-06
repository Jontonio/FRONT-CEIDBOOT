import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Curso } from 'src/app/main/curso/class/Curso';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-form-select-idioma',
  templateUrl: './form-select-idioma.component.html',
  styleUrls: ['./form-select-idioma.component.scss']
})
export class FormSelectIdiomaComponent implements OnInit {

  @Output() formData =  new EventEmitter<Curso>();
  @Input()  formCurso:FormGroup;

  listCursos :Curso[] = [];
  selectCurso:Curso;

  constructor( private readonly _global:GlobalService ) {
    this.getListCursos();
  }

  ngOnInit(): void { }

  getListCursos(){
    this._global.getCursosInscripcion().subscribe({
      next:(value) => {
        if(value.ok){
          this.listCursos = value.data as Array<Curso>;
          console.log(value)
          return;
        }
      },
      error:(e) => {
        console.log(e)
      }
    })
  }

  // getters
  get curso(){
    return this.formCurso.controls['curso'];
  }

  selectedCurso(curso:Curso){
    this.selectCurso = curso;
    this.formData.emit(curso);
  }
}
