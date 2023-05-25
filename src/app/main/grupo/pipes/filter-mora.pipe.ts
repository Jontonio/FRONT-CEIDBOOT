import { Pipe, PipeTransform } from '@angular/core';
import { Mora } from '../class/Mora';

@Pipe({
  name: 'filterMora'
})
export class FilterMoraPipe implements PipeTransform {

  transform(listaMora: Mora[]): Mora[] {
    return listaMora.filter(mora => mora.EstadoMora===true);
  }

}
