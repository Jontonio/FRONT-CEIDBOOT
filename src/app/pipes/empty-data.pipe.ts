import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'empty'
})
export class EmptyDataPipe implements PipeTransform {

  transform(value: string | null, name:string): string  {
    if(value) return value;
    return `Campo sin ${name}`;
  }

}
