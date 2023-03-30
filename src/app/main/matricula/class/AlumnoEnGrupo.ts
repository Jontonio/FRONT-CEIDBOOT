import { Curso } from "../../curso/class/Curso";
import { Grupo } from "../../grupo/class/Grupo";
import { Estudiante } from "./Estudiante";
import { Matricula } from "./Matricula";

class ResAddEnGrupo {
  constructor(public msg:string, public ok:boolean, public data:AlumnoEnGrupo | AlumnoEnGrupo[], public count?:number){}
}

class AlumnoEnGrupo {
  estudiante: Estudiante;
  grupo: Grupo;
  matricula: Matricula;
  Id: number;
  Estado: boolean;
  createdAt: string;
  updateddAt: string;
}
export { ResAddEnGrupo, AlumnoEnGrupo }
