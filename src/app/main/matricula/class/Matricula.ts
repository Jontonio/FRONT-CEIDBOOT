import { Curso } from "../../curso/class/Curso";
import { Estudiante } from "./Estudiante";
import { Institucion } from "./Institucion";
import { Servicio } from "./Servicio";

class ResMatricula{
  constructor(public msg:string, public  ok:boolean, public data: Matricula | Matricula[], public count?:number){}
}


class Matricula {

  DeclaraJurada:boolean;
  RequiTecnologico:boolean;
  CarCompromiso:boolean;
  estudiante:Estudiante;
  denomiServicio:Servicio;
  curso:Curso;
  institucion:Institucion;
  createdAt?:string;
  updatedAt?:string;


  constructor(DeclaraJurada:boolean,
              RequiTecnologico:boolean,
              CarCompromiso:boolean,
              estudiante:Estudiante,
              denomiServicio:Servicio,
              curso:Curso,
              institucion:Institucion){
                this.DeclaraJurada = DeclaraJurada;
                this.RequiTecnologico = RequiTecnologico;
                this.CarCompromiso = CarCompromiso;
                this.estudiante = estudiante;
                this.denomiServicio = denomiServicio;
                this.curso = curso;
                this.institucion = institucion;
  }

}



export { ResMatricula, Matricula }
