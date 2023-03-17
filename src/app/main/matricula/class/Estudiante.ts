import { Departamento, Distrito, Provincia } from "../../class/Ubigeo";
import { Apoderado } from "./Apoderado";

class ResEstudiante{
  constructor(public msg:string, public  ok:boolean, public data: Estudiante | Estudiante[], public count?:number){}
}

class Estudiante {

  DNI:string;
  Nombres:string;
  ApellidoPaterno:string;
  ApellidoMaterno:string;
  Celular:string;
  Sexo:string;
  FechaNacimiento:string;
  Direccion:string;
  Email:string;
  EsMayor:string;
  apoderado:Apoderado;
  departamento:Departamento;
  provincia:Provincia;
  distrito:Distrito;

  constructor(DNI:string,
              Nombres:string,
              ApellidoPaterno:string,
              ApellidoMaterno:string,
              Celular:string,
              Sexo:string,
              FechaNacimiento:string,
              Direccion:string,
              Email:string,
              EsMayor:string,
              apoderado:Apoderado,
              departamento:Departamento,
              provincia:Provincia,
              distrito:Distrito){

                this.DNI = DNI;
                this.Nombres = Nombres;
                this.ApellidoPaterno = ApellidoPaterno;
                this.ApellidoMaterno = ApellidoMaterno;
                this.Celular = Celular;
                this.Sexo = Sexo;
                this.FechaNacimiento = FechaNacimiento;
                this.Direccion = Direccion;
                this.Email = Email;
                this.EsMayor = EsMayor;
                this.apoderado = apoderado;
                this.departamento = departamento;
                this.provincia = provincia;
                this.distrito = distrito;
  }
}


export { Estudiante, ResEstudiante }
