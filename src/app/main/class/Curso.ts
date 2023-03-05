export interface ResCurso {
  msg: string;
  ok: boolean;
  data: Curso;
}
export interface ResGetCurso{
  msg: string;
  ok: boolean;
  count:number;
  data: Curso[];
}

export class Curso {
  Id?: number;
  NombrePais: string;
  UrlBandera: string;
  NombreCurso: string;
  NivelCurso: string;
  DescripcionCurso: string;
  NumModulos: number;
  Estado?: boolean;
  createdAt?: string;
  updatedAt?: string;

  constructor(
    NombrePais: string,
    UrlBandera: string,
    NombreCurso: string,
    NivelCurso: string,
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
      this.NivelCurso = NivelCurso;
      this.DescripcionCurso = DescripcionCurso;
      this.NumModulos = NumModulos;
      this.Estado = Estado;
      this.createdAt = createdAt;
      this.updatedAt = updatedAt;
  }
}
