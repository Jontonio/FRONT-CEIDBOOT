import { Pipe, PipeTransform } from '@angular/core';
import { Curso } from '../class/Curso';

@Pipe({
  name: 'buscarCurso'
})
export class BuscarCursoPipe implements PipeTransform {

  transform(listaCursos: Curso[], termino:string): Curso[] {
    if(!termino) return listaCursos;
    return listaCursos
           .filter( curso =>
            `${curso.NombreCurso.toLowerCase()}}`.includes(termino.toLowerCase()) || `${curso.nivel.Nivel}`.includes(termino.toLowerCase()));
  }

}
