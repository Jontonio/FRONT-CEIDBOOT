class ResModulo{
  constructor(public msg:string, public ok:boolean, public data:Modulo | Modulo[], public count?:number){}
}

class Modulo {
  Id: number;
  Modulo: number;
  Estado: boolean;
  createdAt: string;
  updatedAt: string;
}

export { ResModulo, Modulo }
