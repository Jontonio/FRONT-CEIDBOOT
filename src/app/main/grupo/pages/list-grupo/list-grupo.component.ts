import { Component } from '@angular/core';
import { GrupoService } from 'src/app/main/grupo/services/grupo.service';
import { EstadoGrupo } from '../../class/EstadoGrupo';

@Component({
  selector: 'app-list-grupo',
  templateUrl: './list-grupo.component.html',
  styleUrls: ['./list-grupo.component.scss']
})
export class ListGrupoComponent {

  /** Variables de clase */
  startPage:number
  selectEstadoGrupo:string;
  selectCodeEstado:string;
  listEstadosGrupo:EstadoGrupo[];
  terminoBusqueda:string;

  constructor(public readonly _grupo:GrupoService) {
    this.getListaEstadosGrupo();
    this.inicializeVariables();
  }

  ngOnDestroy(): void {
    if(this._grupo.listGrupos$) this._grupo.listGrupos$.unsubscribe();
  }

  inicializeVariables(){
    this.startPage = 0;
    this.selectEstadoGrupo = 'Mostrar todo';
    this.selectCodeEstado = 'all';
    this.listEstadosGrupo= [];
  }

  getListaEstadosGrupo(){
    this._grupo.getAllEstadoGrupo()
    .subscribe({
      next: (value) => {
        const newArr = [...value.data as EstadoGrupo[], {EstadoGrupo: 'Mostrar todo', CodeEstado: 'all'}];
        this.listEstadosGrupo = newArr as Array<EstadoGrupo>;
      }
    })
  }

  selectForFiltro({ EstadoGrupo, CodeEstado}:EstadoGrupo){
    this.selectEstadoGrupo = EstadoGrupo;
    this.selectCodeEstado = CodeEstado;
  }

  paginate(event:any) {
    this.startPage = event.first;
    this._grupo.getListaGrupos(event.rows, event.first);
  }

}
