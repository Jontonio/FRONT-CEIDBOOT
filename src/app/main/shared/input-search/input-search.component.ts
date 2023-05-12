import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { debounceTime, Subject } from 'rxjs';

@Component({
  selector: 'app-input-search',
  templateUrl: './input-search.component.html',
  styleUrls: ['./input-search.component.scss']
})
export class InputSearchComponent implements OnInit {

  @Output() busqueda = new EventEmitter<string>();
  @Input() placeholder:string = 'Buscar';
  debouncer = new Subject();
  termino:string;

  constructor() { }

  ngOnInit(): void {
    this.debouncer.pipe(
        debounceTime(300)
      ).subscribe({
        next:(resp) => {
          this.busqueda.emit(resp as string)
        },
        error:(e) => console.log(e)
    })
  }

  teclaPresionada(){
    this.debouncer.next( this.termino );
  }

  clear(){
    this.termino = '';
    this.busqueda.emit( this.termino );
  }

}
