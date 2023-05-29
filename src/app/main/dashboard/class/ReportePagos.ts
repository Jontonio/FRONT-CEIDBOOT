
class ReportePagos{
  Nombres:string;
  ApellidoMaterno:string;
  ApellidoPaterno:string;
  CodigoVoucher:string;
  FechaPago:Date;
  MedioDePago:string;
  Modulo:number;
  MontoPago:number;
  TipoCategoriaPago:string;
  grupoId:number;
}

class ReporteGeneral{
  Nivel:string;
  NombreCurso:string;
  Num_mes:number;
  TipoCategoriaPago: number;
  grupoId: number;
  total_pago: number;
}

class ReporteOtrosPagos{
  Num_mes:number;
  TipoTramite:string;
  total_pago:number;
}

class Data{
  name:string;
  value:number;
}

class IndicePago{
  total:Data[];
  indice:Data[];
}

export { ReportePagos, ReporteGeneral, ReporteOtrosPagos, IndicePago, Data}
