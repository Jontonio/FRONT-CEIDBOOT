import { Curso } from "../../curso/class/Curso";
import { Grupo } from "../../grupo/class/Grupo";
import { Horario } from "../../grupo/class/Horario";
import { Estudiante } from "./Estudiante";
import { Institucion } from "./Institucion";
import { Servicio } from "./Servicio";

class ResMatricula{
  constructor(public msg:string, public  ok:boolean, public data: Matricula | Matricula[], public count?:number){}
}


class Matricula {

  Id:number;
  DeclaraJurada:boolean;
  RequiTecnologico:boolean;
  CarCompromiso:boolean;
  estudiante:Estudiante;
  EstadoMatricula:string;
  denomiServicio:Servicio;
  institucion:Institucion;
  FileMatriculaURL:string;
  curso?:Curso;
  horario?:Horario;
  createdAt?:string;
  updatedAt?:string;


  constructor(DeclaraJurada:boolean,
              RequiTecnologico:boolean,
              CarCompromiso:boolean,
              estudiante:Estudiante,
              denomiServicio:Servicio,
              institucion:Institucion,
              FileMatriculaURL:string,
              curso?:Curso,
              horario?:Horario){
                this.DeclaraJurada = DeclaraJurada;
                this.RequiTecnologico = RequiTecnologico;
                this.CarCompromiso = CarCompromiso;
                this.estudiante = estudiante;
                this.denomiServicio = denomiServicio;
                this.institucion = institucion;
                this.FileMatriculaURL = FileMatriculaURL;
                this.curso = curso;
                this.horario = horario;
  }

  /** seters */
  setCurso(curso:Curso){
    this.curso = curso;
  }

  setHorario(horario:Horario){
    this.horario = horario;
  }

}



export { ResMatricula, Matricula }
