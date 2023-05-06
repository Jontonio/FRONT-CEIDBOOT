import { Estudiante } from "../../matricula/class/Estudiante";
import { Matricula } from "../../matricula/class/Matricula";
import { EstadoGrupoEstudiante } from "./EstadoGrupoEstudiante";
import { Grupo } from "./Grupo";
import { Pago } from "./Pago";

class ResEstudianteEnGrupo {
  constructor(public msg: string, public ok: boolean, public data: EstudianteEnGrupo | EstudianteEnGrupo[], public count?:number){}
}

class ResEstadoEstudEnGrupo {
  constructor(public msg: string, public ok: boolean, public data: EstadoGrupoEstudiante, public count?:number){}
}

class EstudianteEnGrupo {
  Id:number
  estudiante:Estudiante;
  grupo:Grupo;
  Estado:boolean;
  matricula:Matricula;
  pagos?:Pago[];
  createdAt:Date;
  updateddAt:Date;

  constructor(estudiante:Estudiante, grupo:Grupo, matricula:Matricula, pago?:Pago[]){
    this.estudiante = estudiante;
    this.grupo = grupo;
    this.matricula = matricula;
    this.pagos = pago;
  }
}

export {
  EstudianteEnGrupo,
  ResEstudianteEnGrupo,
  ResEstadoEstudEnGrupo
}
