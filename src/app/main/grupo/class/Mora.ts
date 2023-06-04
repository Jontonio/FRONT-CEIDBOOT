import { EstudianteEnGrupo } from "./EstudianteGrupo";
import { GrupoModulo } from "./GrupoModulo";

class ResMora {
  constructor(public msg:string,public  ok:boolean, public data:Mora | Mora[], public count?:number){}
}

class Mora{
  Id:number;
  EstadoMora:boolean;
  Verificado:boolean;
  MontoMora:number;
  createdAt:Date;
  updatedAt:Date;
  grupoModulo:GrupoModulo;
  estudianteEnGrupo:EstudianteEnGrupo;

  constructor(MontoMora:number, grupoModulo:GrupoModulo, estudianteEnGrupo:EstudianteEnGrupo){
    this.MontoMora = MontoMora;
    this.grupoModulo = grupoModulo;
    this.estudianteEnGrupo = estudianteEnGrupo;
  }
}

export { Mora, ResMora }
