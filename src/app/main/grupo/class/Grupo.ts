import { Curso } from "../../curso/class/Curso";
import { Docente } from "../../docente/class/Docente";
import { EstadoGrupo } from "./EstadoGrupo";
import { GrupoModulo } from "./GrupoModulo";
import { Horario } from "./Horario";

class ResGrupo {
  constructor(public msg: string, public ok: boolean, public data: Grupo | Grupo[], public count?:number){}
}

class ResTipoGrupo {
  constructor(public msg: string, public ok: boolean, public data: TipoGrupo | TipoGrupo[], public count?:number){}
}

class Grupo {
  Id: number;
  FechaInicioGrupo:Date;
  FechaFinalGrupo:Date;
  DescGrupo: string;
  MaximoEstudiantes:number;
  NumeroEstudiantes:number;
  Estado: boolean;
  Modalidad:string;
  RequeridoPPago:boolean;
  createdAt?: string;
  updatedAt?: string;
  docente:Docente;
  estadoGrupo:EstadoGrupo;
  horario:Horario;
  tipoGrupo:TipoGrupo;
  curso:Curso;
  grupoModulo:GrupoModulo[];
  AplicaMora: boolean;
  MontoMora: number;
  NotificarGrupo: boolean;
  NumDiasHolaguraMora: number;
}

class TipoGrupo {
  Id: number;
  NombreGrupo: string;
  DescGrupo: string;
  Estado: boolean;
  createdAt: string;
  updatedAt: string;
}

export {
  Grupo,
  ResGrupo,
  TipoGrupo,
  ResTipoGrupo
}
