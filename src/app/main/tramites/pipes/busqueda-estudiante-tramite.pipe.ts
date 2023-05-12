import { Pipe, PipeTransform } from '@angular/core';
import { Tramite } from 'src/app/class/Tramite';

@Pipe({
  name: 'busdTramite'
})
export class BusquedaEstudianteTramitePipe implements PipeTransform {

  transform(listaTramites:Tramite[],termino: string): Tramite[] {
    if(!termino) return listaTramites;
    return listaTramites
           .filter( tramite =>
            `${tramite.estudiante.Nombres.toLowerCase()} ${tramite.estudiante.ApellidoPaterno.toLowerCase()}}`
            .includes(termino.toLowerCase()) || `${tramite.estudiante.Documento}`.includes(termino.toLowerCase()));
  }

}
