
class ResCategoriaPago {
  constructor(public msg: string, public ok: boolean, public data: CategoriaPago | CategoriaPago[], public count?:number){}
}

class CategoriaPago{
    Id:number;
    TipoCategoriaPago:string;
    Estado:boolean;
    createdAt:Date;
    updatedAt:Date;
    constructor(TipoCategoriaPago:string){
      this.TipoCategoriaPago = TipoCategoriaPago;
    }
}

export { ResCategoriaPago, CategoriaPago }
