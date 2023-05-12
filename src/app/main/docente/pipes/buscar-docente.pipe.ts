import { Pipe, PipeTransform } from '@angular/core';
import { Docente } from '../class/Docente';

@Pipe({
  name: 'buscarDocente'
})
export class BuscarDocentePipe implements PipeTransform {

  transform(listaDocentes: Docente[], termino:string): Docente[] {
    if(!termino) return listaDocentes;
    return listaDocentes
           .filter( docente =>
            `${docente.Nombres.toLowerCase()} ${docente.ApellidoPaterno.toLowerCase()}}`.includes(termino.toLowerCase()) || `${docente.Documento}`.includes(termino.toLowerCase()));
  }

}
