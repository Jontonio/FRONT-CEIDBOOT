import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { DataHorizontalBar, DataVerticalBar } from "src/app/class/Graphics";
import { SocketService } from "src/app/services/socket.service";
import { UnAuthorizedService } from "src/app/services/unauthorized.service";
import { environment } from 'src/environments/environment';
import { ResGrupo } from "../../grupo/class/Grupo";
import { ResModulo } from "../../curso/class/Modulo";
import { ResCategoriaPago } from "../../grupo/class/CategoriaPago";
import { IndicePago, ReporteGeneral, ReporteOtrosPagos, ReportePagos } from "../class/ReportePagos";

@Injectable({
  providedIn:'root'
})
export class DashboardService {

  private BASE_URL:string;


  constructor(private http:HttpClient){
    this.BASE_URL = environment.BASE_URL
  }

  getDataHorizontalBarEstudinatesEnGrupo(idEstadoGrupo:number){
    return this.http.get<DataHorizontalBar[]>(`${this.BASE_URL}/grupo/get-data-horizontal-bar-estudiantes-grupos/${idEstadoGrupo}`);
  }

  getDataVerticalBarPagosMora(grupoId:number = 1, estadoGrupoId:number = 1){
    return this.http.get<DataVerticalBar[]>(`${this.BASE_URL}/grupo/get-data-vertical-bar-pagos-mora/${grupoId}/${estadoGrupoId}`);
  }

  getListaEstudiantesConPagoGrupoModulo(IdGrupo:number, IdCategoriaPago:number, Modulo:number){
    return this.http.get<ReportePagos[]>(`${this.BASE_URL}/reports/lista-estudiantes-pago-categoria-modulo-grupo/${IdGrupo}/${IdCategoriaPago}/${Modulo}`);
  }

  getListaModulos(){
    return this.http.get<ResModulo>(`${this.BASE_URL}/curso/get-modulos`);
  }

  getCategoriasPago(){
    return this.http.get<ResCategoriaPago>(`${this.BASE_URL}/categoria-pago/get-all-categoria-pago`);
  }

  getResumenGeneralPagos(anio:string, numMes:string){
    return this.http.get<ReporteGeneral[]>(`${this.BASE_URL}/reports/resumen-total-pagos-por-categoria-grupo/${anio}/${numMes}`);
  }

  getReproteOtrosPagos(anio:string, numMes:string){
    return this.http.get<ReporteOtrosPagos[]>(`${this.BASE_URL}/reports/reporte-pagos-otros-tipos/${anio}/${numMes}`);
  }

  getIndiceDeDeudaVencida(grupoId:number){
    return this.http.get<IndicePago>(`${this.BASE_URL}/reports/indice-deuda-grupos-en-proceso/${grupoId}`);
  }

}
