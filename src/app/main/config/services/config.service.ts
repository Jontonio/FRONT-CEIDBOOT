import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { EstadoGrupo, ResEstadoGrupo } from "../../grupo/class/EstadoGrupo";
import { Observable } from 'rxjs';
import { environment } from "src/environments/environment";
import { CategoriaPago, ResCategoriaPago } from "../../grupo/class/CategoriaPago";
import { ResTipoTramite, TipoTramite } from "../../class/TipoTramite";
import { MedioPago, ResMedioDePago } from "src/app/class/MedioDePago";
import { DenominServicio, ResDenominServicio } from "src/app/denomin-servicio/class/Denomin-servicio";
import { TipoGrupo } from "../../grupo/class/Grupo";
import { ResTramite } from "src/app/class/Tramite";

@Injectable({
  providedIn:'root'
})
export class ConfigService {

  /** variables de clase */
  private BASE_URL:string;

  constructor( private readonly http:HttpClient ){
    this.BASE_URL = environment.BASE_URL;
  }

  createEstadoGrupo(data:EstadoGrupo):Observable<ResEstadoGrupo>{
    return this.http.post<ResEstadoGrupo>(`${this.BASE_URL}/estado-grupo/create-estado-grupo`, data);
  }
  /** Estado grupos */
  getEstadosGrupo():Observable<ResEstadoGrupo>{
    return this.http.get<ResEstadoGrupo>(`${this.BASE_URL}/estado-grupo/get-lista-estados`);
  }

  /** Categoria de pago */
  getCategoriasPago():Observable<ResCategoriaPago>{
    return this.http.get<ResCategoriaPago>(`${this.BASE_URL}/categoria-pago/get-all-categoria-pago`);
  }

  /** Tipos de trámite */
  getTiposTramite():Observable<ResTipoTramite>{
    return this.http.get<ResTipoTramite>(`${this.BASE_URL}/tipo-tramite/get-list-register`);
  }

  /** Medios de  pago */
  getMediosPago():Observable<ResMedioDePago>{
    return this.http.get<ResMedioDePago>(`${this.BASE_URL}/medio-de-pago/get-all-medios-pago`);
  }

  /** Denominación de servicios */
  getDenominServicio():Observable<ResDenominServicio>{
    return this.http.get<ResDenominServicio>(`${this.BASE_URL}/denomin-servicio/get-lista-denomin-servicios`);
  }

  createDenominacionServicio(data:DenominServicio){
    return this.http.post<ResDenominServicio>(`${this.BASE_URL}/denomin-servicio/create-denomin-servicio`, data);
  }

  createTipoTramite(data:TipoTramite){
    return this.http.post<ResTipoTramite>(`${this.BASE_URL}/tipo-tramite/register-tipo-tramite`, data);
  }

  createMedioPago(data:MedioPago){
    return this.http.post<ResMedioDePago>(`${this.BASE_URL}/medio-de-pago/register-medio-pago`, data);
  }

  createCategoriaPago(data:CategoriaPago){
    return this.http.post<ResCategoriaPago>(`${this.BASE_URL}/categoria-pago/create-categoria-pago`, data);
  }

  updateDenominServicio(Id:number, data:DenominServicio){
    return this.http.patch<ResDenominServicio>(`${this.BASE_URL}/denomin-servicio/update-denomin-servicio/${Id}`, data);
  }

  updateTipoTramite(Id:number, data:TipoTramite){
    return this.http.patch<ResTipoTramite>(`${this.BASE_URL}/tipo-tramite/update-tipo-tramite/${Id}`, data);
  }

  updateCategoriaPago(Id:number, data:CategoriaPago){
    return this.http.patch<ResCategoriaPago>(`${this.BASE_URL}/categoria-pago/update-categoria-pago/${Id}`, data);
  }

  updateMedioPago(Id:number, data:MedioPago){
    return this.http.patch<ResMedioDePago>(`${this.BASE_URL}/medio-de-pago/update-medio-pago/${Id}`, data);
  }

  updateEstadoGrupo(Id:number, data:EstadoGrupo){
    return this.http.patch<ResEstadoGrupo>(`${this.BASE_URL}/estado-grupo/update-estado-grupo/${Id}`, data);
  }

  deleteDenominServicio(Id:number){
    return this.http.delete<ResDenominServicio>(`${this.BASE_URL}/denomin-servicio/delete-denomin-servicio/${Id}`);
  }

  deleteTipoTramite(Id:number){
    return this.http.delete<ResTramite>(`${this.BASE_URL}/tipo-tramite/delete-tipo-tramite/${Id}`);
  }

  deleteMedioPago(Id:number){
    return this.http.delete<ResMedioDePago>(`${this.BASE_URL}/medio-de-pago/delete-medio-pago/${Id}`);
  }

  deleteCategoriaPago(Id:number){
    return this.http.delete<ResCategoriaPago>(`${this.BASE_URL}/categoria-pago/delete-categoria-pago/${Id}`);
  }

  deleteEstadoGrupo(Id:number){
    return this.http.delete<ResEstadoGrupo>(`${this.BASE_URL}/estado-grupo/delete-estado-grupo/${Id}`);
  }

}
