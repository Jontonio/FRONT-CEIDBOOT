import { MedioPago } from "src/app/class/MedioDePago";
import { CategoriaPago } from "./CategoriaPago";
import { EstudianteEnGrupo } from "./EstudianteGrupo";

class ResPago {
  constructor(public msg: string, public ok: boolean, public data: Pago | Pago[], public count?:number){}
}

class Pago{
    Id:number;
    VoucherUrl:string;
    FechaPago:Date;
    MontoPago:number;
    CodigoVoucher:string;
    Verificado:boolean;
    categoriaPago?:CategoriaPago;
    createdAt:Date;
    updatedAt:Date;
    medioDePago:MedioPago;
    estudianteEnGrupo?:EstudianteEnGrupo;
    constructor(VoucherUrl:string, FechaPago:Date, CodigoVocuher:string, MontoPago:number, medioDePago:MedioPago, categoriaPago?:CategoriaPago, estudianteEnGrupo?:EstudianteEnGrupo){
      this.VoucherUrl = VoucherUrl
      this.estudianteEnGrupo = estudianteEnGrupo;
      this.FechaPago = FechaPago;
      this.CodigoVoucher = CodigoVocuher;
      this.categoriaPago = categoriaPago;
      this.MontoPago = MontoPago;
      this.medioDePago = medioDePago;
    }
}

export { ResPago, Pago }
