import { Pipe, PipeTransform } from '@angular/core';
import { Matricula } from '../class/Matricula';

@Pipe({
  name: 'buscarMatricula'
})
export class BuscarMatriculaPipe implements PipeTransform {

  transform(listaMAtricula:Matricula[],termino: string): Matricula[] {
    if(!termino) return listaMAtricula;
    return listaMAtricula
           .filter( matricula =>
            `${matricula.estudiante.Nombres.toLowerCase()} ${matricula.estudiante.ApellidoPaterno.toLowerCase()}}`
            .includes(termino.toLowerCase()) || `${matricula.estudiante.Documento}`.includes(termino.toLowerCase()));
  }

}
