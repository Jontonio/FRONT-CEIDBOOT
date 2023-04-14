import { Curso } from "../../curso/class/Curso";
import { Docente } from "../../docente/class/Docente";
import { Horario } from "./Horario";

class ResGrupo {
  constructor(public msg: string, public ok: boolean, public data: Grupo | Grupo[], public count?:number){}
}

class ResTipoGrupo {
  constructor(public msg: string, public ok: boolean, public data: TipoGrupo | TipoGrupo[], public count?:number){}
}

class Grupo {
  Id?: number;
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
  horario:Horario;
  tipoGrupo:TipoGrupo;
  curso:Curso;
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
