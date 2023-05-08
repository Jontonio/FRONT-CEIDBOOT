class ResTipoTramite{
  constructor(public msg:string, public ok:boolean, public data:TipoTramite | TipoTramite[], count?:number){}
}

class TipoTramite {
  Id: number;
  DerechoPagoTramite: number;
  TipoTramite: string;
  DescripcionTramite: string;
  createdAt: string;
  updatedAt: string;

  constructor(DerechoPagoTramite:number, TipoTramite:string, DescripcionTramite:string){
    this.DerechoPagoTramite = DerechoPagoTramite;
    this.TipoTramite = TipoTramite;
    this.DescripcionTramite = DescripcionTramite;
  }
}


export { ResTipoTramite, TipoTramite }
