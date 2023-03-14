import { Rol } from "src/app/class/Rol";

class ResUsuario{
  constructor(public msg:string, public  ok:boolean, public data: Usuario | Usuario[], public count?:number){}
}

class Usuario{

  DNI:number;
  Nombres: string;
  ApellidoMaterno: string;
  ApellidoPaterno: string;
  Email: string;
  Celular: number;
  Direccion: string;
  rol:Rol;
  Habilitado:boolean;
  Code:string;
  CodePhone:string;
  Id?: number;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(
    DNI:number,
    Nombres:string,
    ApellidoPaterno:string,
    ApellidoMaterno:string,
    Celular:number,
    Email:string,
    Direccion:string,
    rol:Rol,
    Code:string,
    CodePhone:string,
    Id?:number,
    createdAt?:Date,
    updatedAt?:Date){

    this.DNI = Number(DNI);
    this.ApellidoPaterno = ApellidoPaterno;
    this.ApellidoMaterno = ApellidoMaterno;
    this.Celular = Number(Celular);
    this.Direccion = Direccion;
    this.Email = Email;
    this.Nombres = Nombres;
    this.rol = rol;
    this.Code = Code;
    this.CodePhone = CodePhone;
    this.Id = Id;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

export { ResUsuario, Usuario };
