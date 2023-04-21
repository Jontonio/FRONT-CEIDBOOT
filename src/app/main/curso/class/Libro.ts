import { Curso } from "./Curso";

class ResLibro {
  constructor(public msg:string, public ok:boolean, public data: Libro | Libro[], public count?:number){}
}

class Libro {
  Id: string;
  TituloLibro: string;
  CostoLibro: number;
  DescripcionLibro: string;
  Estado: boolean;
  createdAt: string;
  updatedAt: string;
  curso?:Curso;

  constructor(TituloLibro:string, CostoLibro:number, DescripcionLibro:string, curso?:Curso){
    this.TituloLibro = TituloLibro;
    this.CostoLibro = CostoLibro;
    this.DescripcionLibro = DescripcionLibro;
    this.curso = curso;
  }
}

export { Libro, ResLibro }
