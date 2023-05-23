
class ResCategoriaPago {
  constructor(public msg: string, public ok: boolean, public data: CategoriaPago | CategoriaPago[], public count?:number){}
}

class CategoriaPago{
    Id:number;
    TipoCategoriaPago:string;
    CodeCategoriaPago:string;
    Estado:boolean;
    createdAt:Date;
    updatedAt:Date;
    constructor(TipoCategoriaPago:string, CodeCategoriaPago:string){
      this.TipoCategoriaPago = TipoCategoriaPago.toLowerCase();
      this.CodeCategoriaPago = CodeCategoriaPago.toLocaleLowerCase();
    }
}

export { ResCategoriaPago, CategoriaPago }
