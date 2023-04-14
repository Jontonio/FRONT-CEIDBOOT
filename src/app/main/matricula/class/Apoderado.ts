class ResApoderado{
  constructor(public msg:string, public  ok:boolean, public data: Apoderado | Apoderado[], public count?:number){}
}

class Apoderado {
  Id?:number;
  ApellidoMApoderado:string;
  ApellidoPApoderado:string;
  CelApoderado:string;
  TipoDocumento:string;
  Documento:string;
  Estado:boolean;
  NomApoderado:string;
  Code:string;
  CodePhone:string;
  createdAt:Date;
  updateAt:Date;

  constructor(TipoDocumento:string, Documento:string, Nombres:string, ApellidoPaterno:string, ApellidoMaterno:string, Celular:string, Code:string, CodePhone:string){
    this.ApellidoMApoderado = ApellidoMaterno;
    this.ApellidoPApoderado = ApellidoPaterno;
    this.CelApoderado = Celular;
    this.TipoDocumento = TipoDocumento;
    this.Documento = Documento;
    this.NomApoderado = Nombres;
    this.Code = Code;
    this.CodePhone = CodePhone;
  }

}

export { Apoderado, ResApoderado }
