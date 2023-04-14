import { Estudiante } from "../../matricula/class/Estudiante";
import { Matricula } from "../../matricula/class/Matricula";
import { Grupo } from "./Grupo";
import { Mensualidad } from "./Mensualidad";

class ResEstudianteEnGrupo {
  constructor(public msg: string, public ok: boolean, public data: EstudianteEnGrupo | EstudianteEnGrupo[], public count?:number){}
}

class EstudianteEnGrupo {
  Id:number
  estudiante:Estudiante;
  grupo:Grupo;
  Estado:boolean;
  matricula:Matricula;
  mensualidades?:Mensualidad;
  createdAt:Date;
  updateddAt:Date;

  constructor(estudiante:Estudiante, grupo:Grupo, matricula:Matricula, mensualidad?:Mensualidad){
    this.estudiante = estudiante;
    this.grupo = grupo;
    this.matricula = matricula;
    this.mensualidades = mensualidad;
  }
}

export {
  EstudianteEnGrupo,
  ResEstudianteEnGrupo,
}
