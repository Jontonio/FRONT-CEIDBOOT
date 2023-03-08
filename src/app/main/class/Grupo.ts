import { Curso } from "./Curso";
import { Docente } from "./Docente";
import { Horario } from "./Horario";

interface ResGrupo {
  msg: string;
  ok: boolean;
  data: Grupo;
}

interface ResGetGrupo {
  msg: string;
  ok: boolean;
  count:number;
  data: Grupo[];
}

interface ResGetTipoGrupo {
  msg: string;
  ok: boolean;
  count:number;
  data: TipoGrupo[];
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
  ResGetGrupo,
  TipoGrupo,
  ResGetTipoGrupo
}
