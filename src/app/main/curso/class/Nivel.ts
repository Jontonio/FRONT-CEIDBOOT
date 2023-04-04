class ResNivel {
  constructor(public msg:string, public ok:boolean, public data: Nivel | Nivel[], public count?:number){}
}

class Nivel {
  Id: number;
  Nivel: string;
  Estado: boolean;
  createdAt: string;
  updatedAt: string;
  constructor(Nivel:string){
    this.Nivel = Nivel;
  }
}

export { Nivel, ResNivel }
