class ResDocente {
    constructor(public msg:string, public ok:boolean, public data:Docente | Docente[], public count?:number){}
}
class Docente {
    ApellidoMaterno: string;
    ApellidoPaterno: string;
    Celular: number;
    Documento: number;
    TipoDocumento: string;
    Direccion: string;
    Email: string;
    Nombres: string;
    Code:string;
    CodePhone:string;
    Id?: number;
    createdAt?: Date;
    updatedAt?: Date;

    constructor(
      TipoDocumento:string,
      Documento:number,
      Nombres:string,
      ApellidoPaterno:string,
      ApellidoMaterno:string,
      Celular:number,
      Email:string,
      Direccion:string,
      Code:string,
      CodePhone:string,
      Id?:number,
      createdAt?:Date,
      updatedAt?:Date){

      this.ApellidoMaterno = ApellidoMaterno;
      this.ApellidoPaterno = ApellidoPaterno;
      this.Celular = Number(Celular);
      this.Documento = Number(Documento);
      this.TipoDocumento = TipoDocumento;
      this.Direccion = Direccion;
      this.Email = Email;
      this.Nombres = Nombres;
      this.Id = Id;
      this.Code = Code;
      this.CodePhone = CodePhone;
      this.createdAt = createdAt;
      this.updatedAt = updatedAt;
    }
  }

  export { Docente, ResDocente };
