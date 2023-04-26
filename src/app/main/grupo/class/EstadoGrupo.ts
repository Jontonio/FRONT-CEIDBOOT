
class ResEstadoGrupo {
  constructor(public msg: string, public ok: boolean, public data: EstadoGrupo | EstadoGrupo[], public count?:number){}
}

class EstadoGrupo {
  Id: number;
  EstadoGrupo:string;
  CodeEstado:string;
  DescripcionEstadoGrupo:string;
  Estado:boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(estadoGrupo:string, descripcionEstadoGrupo:string, CodeEstado:string){
    this.EstadoGrupo = estadoGrupo;
    this.DescripcionEstadoGrupo = descripcionEstadoGrupo;
    this.CodeEstado = CodeEstado;
  }

}
export { ResEstadoGrupo, EstadoGrupo }
