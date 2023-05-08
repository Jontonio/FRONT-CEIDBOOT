import { Modulo } from "../../curso/class/Modulo";
import { Grupo } from "./Grupo";

class ResGrupoModulo {
  constructor(public msg: string, public ok: boolean, public data: GrupoModulo | GrupoModulo[], public count?:number){}
}

class GrupoModulo{
  Id: number;
  CurrentModulo: boolean;
  FechaPago: Date;
  modulo: Modulo;
  grupo:Grupo;
  createdAt: Date
  updatedAt: Date;
}

export { GrupoModulo, ResGrupoModulo};
