class ResInstitucion{
  constructor(public msg:string, public  ok:boolean, public data: Institucion | Institucion[], public count?:number){}
}

class Institucion {

  Id?:number;
  NombreInstitucion:string;
  EscuelaProfe:string;
  createdAt?:Date;
  updatedAt?:Date;

  constructor(NombreInstitucion:string, EscuelaProfe:string ){
    this.NombreInstitucion = NombreInstitucion;
    this.EscuelaProfe = EscuelaProfe;
  }

}

export { ResInstitucion, Institucion };
