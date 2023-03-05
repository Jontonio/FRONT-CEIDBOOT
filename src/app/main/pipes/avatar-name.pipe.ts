import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'avatarName'
})
export class AvatarNamePipe implements PipeTransform {

  transform(Nombres: string): string {

    const letra = Nombres.slice(0,1)
    return letra;

  }

}
