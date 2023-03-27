class ResApoderado{
  constructor(public msg:string, public  ok:boolean, public data: Apoderado | Apoderado[], public count?:number){}
}

class Apoderado {
  Id?:number;
  ApellidoMApoderado:string;
  ApellidoPApoderado:string;
  CelApoderado:string;
  DNIApoderado:string;
  Estado:boolean;
  NomApoderado:string;
  createdAt:Date;
  updateAt:Date;

  constructor(DNI:string, Nombres:string, ApellidoPaterno:string, ApellidoMaterno:string, Celular:string){
    this.ApellidoMApoderado = ApellidoMaterno;
    this.ApellidoPApoderado = ApellidoPaterno;
    this.CelApoderado = Celular;
    this.DNIApoderado = DNI
    this.NomApoderado = Nombres;
  }

}

export { Apoderado, ResApoderado }
