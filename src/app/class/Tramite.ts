import { TipoTramite } from "../main/class/TipoTramite";
import { Pago } from "../main/grupo/class/Pago";
import { Estudiante } from "../main/matricula/class/Estudiante";

class ResTramite{
  constructor(public msg:string, public ok:boolean, public data:Tramite | Tramite[], public count?:number){}
}

class Tramite {
  Id: number;
  UrlRequisito: string;
  UrlRequisitoExtra: string;
  tipoTramite: TipoTramite;
  pago: Pago;
  estudiante:Estudiante;
  createdAt: string;
  updatedAt: string;

  constructor(UrlRequisito:string, UrlRequisitoExtra:string, tipoTramite:TipoTramite, pago:Pago, estudiante:Estudiante){
    this.UrlRequisito = UrlRequisito;
    this.UrlRequisitoExtra = UrlRequisitoExtra;
    this.estudiante = estudiante;
    this.tipoTramite = tipoTramite;
    this.pago = pago;
  }
}


export { ResTramite, Tramite }
