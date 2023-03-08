import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'descripcion'
})
export class DescripcionPipe implements PipeTransform {

  transform(value: string): string {

    if(value){
      return value;
    }
    return 'Sin descripción';
  }

}
