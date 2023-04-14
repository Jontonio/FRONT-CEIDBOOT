
export class Mensualidad{
    Id:number;
    VoucherUrl:string;
    FechaPago:Date;
    CodigoVocuher:string;
    createdAt:Date;
    updatedAt:Date;
    constructor(VoucherUrl:string, FechaPago?:Date, CodigoVocuher?:string){
      this.VoucherUrl = VoucherUrl;
    }
}
