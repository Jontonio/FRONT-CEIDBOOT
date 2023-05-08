import { Libro } from "./Libro";
import { Modulo } from "./Modulo";
import { Nivel } from "./Nivel";

class ResCurso {
  constructor(public msg:string, public ok:boolean, public data: Curso | Curso[], public count?:number){}
}

class Curso {
  Id: number;
  NombrePais: string;
  UrlBandera: string;
  NombreCurso: string;
  nivel: Nivel;
  libros:Libro[];
  DescripcionCurso: string;
  modulo: Modulo;
  Estado?: boolean;
  EstadoApertura:boolean;
  PrecioExamSuficiencia:number;
  LinkRequisitos?:string;
  createdAt?: string;
  updatedAt?: string;

  constructor(
    NombrePais: string,
    UrlBandera: string,
    NombreCurso: string,
    nivel: Nivel,
    DescripcionCurso: string,
    modulo: Modulo,
    Estado?: boolean,
    createdAt?: string,
    updatedAt?: string){

      this.NombrePais = NombrePais;
      this.UrlBandera = UrlBandera;
      this.NombreCurso = NombreCurso;
      this.nivel = nivel;
      this.DescripcionCurso = DescripcionCurso;
      this.modulo = modulo;
      this.Estado = Estado;
      this.createdAt = createdAt;
      this.updatedAt = updatedAt;
  }
}

export { Curso, ResCurso}
