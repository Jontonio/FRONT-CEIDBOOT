import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'avatarName'
})
export class AvatarNamePipe implements PipeTransform {

/**
 * This TypeScript function returns the first letter of a given string.
 * @param {string} Nombres - a string representing a person's name.
 * @returns the first character of the input string `Nombres`.
 */
  transform(Nombres: string): string {
    return Nombres.slice(0,1);
  }

}
