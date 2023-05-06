import { Pipe, PipeTransform } from '@angular/core';
import { Grupo } from '../class/Grupo';

@Pipe({
  name: 'statusGrupo'
})
export class FilterStatusGrupoPipe implements PipeTransform {

  transform(listGrupo: Grupo[], termino:string): Grupo[] {
    if(!termino || termino=='all') return listGrupo;
    return listGrupo.filter( grupo => grupo.estadoGrupo.CodeEstado==termino);
  }

}
