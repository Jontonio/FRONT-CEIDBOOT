import { Libro } from "./Libro";
import { Nivel } from "./Nivel";

class ResCurso {
  constructor(public msg:string, public ok:boolean, public data: Curso | Curso[], public count?:number){}
}

class Curso {
  Id?: number;
  NombrePais: string;
  UrlBandera: string;
  NombreCurso: string;
  nivel: Nivel;
  libros:Libro[];
  DescripcionCurso: string;
  NumModulos: number;
  Estado?: boolean;
  EstadoApertura:boolean;
  LinkRequisitos?:string;
  createdAt?: string;
  updatedAt?: string;

  constructor(
    NombrePais: string,
    UrlBandera: string,
    NombreCurso: string,
    nivel: Nivel,
    DescripcionCurso: string,
    NumModulos: number,
    Id?: number,
    Estado?: boolean,
    createdAt?: string,
    updatedAt?: string){

      this.Id = Id;
      this.NombrePais = NombrePais;
      this.UrlBandera = UrlBandera;
      this.NombreCurso = NombreCurso;
      this.nivel = nivel;
      this.DescripcionCurso = DescripcionCurso;
      this.NumModulos = NumModulos;
      this.Estado = Estado;
      this.createdAt = createdAt;
      this.updatedAt = updatedAt;
  }
}

export { Curso, ResCurso}
