class ResApoderado{
  constructor(public msg:string, public  ok:boolean, public data: Apoderado | Apoderado[], public count?:number){}
}

class Apoderado {
  Id?:number;
  DNI:string;
  Nombres:string;
  ApellidoPaterno:string;
  ApellidoMaterno:string;
  Celular:string;
  Estado?:boolean;
  createdAt:Date;
  updateAt:Date;

  constructor(DNI:string, Nombres:string, ApellidoPaterno:string, ApellidoMaterno:string, Celular:string){
    this.DNI = DNI;
    this.Nombres = Nombres;
    this.ApellidoPaterno = ApellidoPaterno;
    this.ApellidoMaterno = ApellidoMaterno;
    this.Celular = Celular;
  }

}

export { Apoderado, ResApoderado }
