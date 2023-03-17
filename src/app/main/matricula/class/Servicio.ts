class ResServicio{
  constructor(public msg:string, public  ok:boolean, public data: Servicio | Servicio[], public count?:number){}
}

class Servicio {
  Id?: number;
  Descripcion: string;
  MontoPension: number;
  MontoMatricula: number;
  Estado: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export { Servicio, ResServicio }
