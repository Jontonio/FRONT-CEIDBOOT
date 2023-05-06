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
}


export { ResTipoTramite, TipoTramite }
