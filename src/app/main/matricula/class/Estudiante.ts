import { Departamento, Distrito, Provincia } from "../../class/Ubigeo";
import { Apoderado } from "./Apoderado";

class ResEstudiante{
  constructor(public msg:string, public  ok:boolean, public data: Estudiante | Estudiante[], public count?:number){}
}

class ResEmailDocEstudiante{
  constructor(public msg:string, public  ok:boolean, public data: Estudiante){}
}

interface EmailDocumento {
  Documento: string;
  Email: string;
}

class Estudiante {
  Id:number;
  TipoDocumento:string;
  Documento:string;
  Nombres:string;
  ApellidoPaterno:string;
  ApellidoMaterno:string;
  Celular:string;
  Code:string;
  CodePhone:string;
  Sexo:string;
  FechaNacimiento:string;
  Direccion:string;
  Email:string;
  EsMayor:string;
  apoderado:Apoderado;
  departamento:Departamento;
  provincia:Provincia;
  distrito:Distrito;

  constructor(TipoDocumento:string,
              Documento:string,
              Nombres:string,
              ApellidoPaterno:string,
              ApellidoMaterno:string,
              Celular:string,
              Code:string,
              CodePhone:string,
              Sexo:string,
              FechaNacimiento:string,
              Direccion:string,
              Email:string,
              EsMayor:string,
              apoderado:Apoderado,
              departamento:Departamento,
              provincia:Provincia,
              distrito:Distrito){

                this.TipoDocumento = TipoDocumento;
                this.Documento = Documento;
                this.Nombres = Nombres;
                this.ApellidoPaterno = ApellidoPaterno;
                this.ApellidoMaterno = ApellidoMaterno;
                this.Celular = Celular;
                this.CodePhone = CodePhone;
                this.Code = Code;
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


export { Estudiante, ResEstudiante, ResEmailDocEstudiante, EmailDocumento }
