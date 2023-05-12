import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fechAcceso'
})
export class FechaAccesoPipe implements PipeTransform {

/**
 * The function returns a string representation of a given date or "Nunca" if the date is undefined or
 * null.
 * @param {any} fecha - The parameter "fecha" is of type "any", which means it can accept any data type
 * as input. It is used as a parameter for a function that transforms a date value into a string. If
 * the input date value is not null or undefined, the function returns the date value as a string
 * @returns a string value. If the input parameter `fecha` is truthy (not null, undefined, false, 0, or
 * an empty string), then it returns the value of `fecha`. Otherwise, it returns the string "Nunca".
 */
  transform(fecha: any):string {
    return fecha?fecha:'Nunca';
  }

}
