
export class ResPerson{
  msg:string;
  ok:boolean;
  data:Person;
  constructor(msg:string, ok:boolean, data:Person){
    this.msg = msg;
    this.ok = ok;
    this.data = data;
  }
}

export class Person {
    dni?:string | undefined;
    nombres:string;
    apellidoPaterno:string;
    apellidoMaterno:string;
    constructor(dni:string, nombres:string, apellidoPaterno:string, apellidoMaterno:string){
        this.dni = dni;
        this.nombres = nombres;
        this.apellidoPaterno = apellidoPaterno;
        this.apellidoMaterno = apellidoMaterno;
    }

}
