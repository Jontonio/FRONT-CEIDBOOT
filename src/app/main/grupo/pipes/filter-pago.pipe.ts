import { Pipe, PipeTransform } from '@angular/core';
import { Pago } from '../class/Pago';

@Pipe({
  name: 'filterPago'
})
export class FilterPagoPipe implements PipeTransform {

  transform(listaPagos: Pago[], tipoFiltro?:string): Pago[] {
    if(!tipoFiltro || tipoFiltro=='Sin filtro') return listaPagos;
    return listaPagos.filter(pago => pago.categoriaPago?.TipoCategoriaPago==tipoFiltro);
  }

}
