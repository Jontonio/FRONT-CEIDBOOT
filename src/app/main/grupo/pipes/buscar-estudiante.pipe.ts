import { Pipe, PipeTransform } from '@angular/core';
import { EstudianteEnGrupo } from '../class/EstudianteGrupo';

@Pipe({
  name: 'buscarEstudiante'
})
export class BuscarEstudiantePipe implements PipeTransform {

  transform(listaEstudiantes: EstudianteEnGrupo[], termino:string): EstudianteEnGrupo[] {
    if(!termino) return listaEstudiantes;
    return listaEstudiantes
           .filter( estudianteEnGrupo =>
            `${estudianteEnGrupo.estudiante.Nombres.toLowerCase()} ${estudianteEnGrupo.estudiante.ApellidoPaterno.toLowerCase()}}`.includes(termino.toLowerCase()) || `${estudianteEnGrupo.estudiante.Documento}`.includes(termino.toLowerCase()));
  }

}
