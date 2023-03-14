import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fechAcceso'
})
export class FechaAccesoPipe implements PipeTransform {

  transform(fecha: any):string {

    if(!fecha){
      return 'Nunca'
    }
    return fecha;
  }

}
