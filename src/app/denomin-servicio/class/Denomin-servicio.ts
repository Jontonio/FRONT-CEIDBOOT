
class ResDenominServicio{
  constructor(public msg:string, public ok:boolean,public data:DenominServicio | DenominServicio[], public count?:number){}
}
class DenominServicio{
  Id: number;
  Descripcion: string;
  MontoPension: number;
  MontoMatricula: number;
  Estado: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(Descripcion:string, MontoPension:number, MontoMatricula:number){
    this.Descripcion = Descripcion;
    this.MontoPension = MontoPension;
    this.MontoMatricula = MontoMatricula;
  }
}

export { DenominServicio, ResDenominServicio }
