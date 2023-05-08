class ResMedioDePago{
  constructor(public msg:string, public ok:boolean, public data:MedioPago | MedioPago[], public count?:string){}
}

class MedioPago {
  Id: number;
  MedioDePago: string;
  createdAt: string;
  updatedAt: string;
  constructor(MedioDePago:string){
    this.MedioDePago = MedioDePago;
  }
}


export { ResMedioDePago, MedioPago }
