import { Pipe, PipeTransform } from '@angular/core';
import { Usuario } from '../class/Usuario';

@Pipe({
  name: 'buscarUsuario'
})
export class BuscarUsuarioPipe implements PipeTransform {

  transform(listaUsuarios:Usuario[],termino: string): Usuario[] {
    if(!termino) return listaUsuarios;
    return listaUsuarios
           .filter( usuario =>
            `${usuario.Nombres.toLowerCase()} ${usuario.ApellidoPaterno.toLowerCase()}}`
            .includes(termino.toLowerCase()) || `${usuario.DNI}`.includes(termino.toLowerCase()));
  }

}
