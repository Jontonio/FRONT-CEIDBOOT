import { Pipe, PipeTransform } from '@angular/core';
import { Grupo } from '../class/Grupo';

@Pipe({
  name: 'filterGrupo'
})
export class FilterGrupoPipe implements PipeTransform {

  transform(listGrupo: Grupo[], termino:string): Grupo[] {
    if(!termino) return listGrupo;
    return listGrupo.
           filter( grupo =>
           `${grupo.curso.NombreCurso.toLowerCase()} ${grupo.curso.nivel.Nivel.toLowerCase()}`.includes(termino.toLowerCase()) || `${grupo.tipoGrupo.NombreGrupo.toLowerCase()}`.includes(termino.toLowerCase()));
  }

}
