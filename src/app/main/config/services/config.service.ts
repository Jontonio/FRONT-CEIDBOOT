import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { EstadoGrupo, ResEstadoGrupo } from "../../grupo/class/EstadoGrupo";
import { Observable } from 'rxjs';
import { environment } from "src/environments/environment";
import { ResCategoriaPago } from "../../grupo/class/CategoriaPago";
import { ResTipoTramite } from "../../class/TipoTramite";
import { ResMedioDePago } from "src/app/class/MedioDePago";
import { ResDenominServicio } from "src/app/denomin-servicio/class/Denomin-servicio";

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
}
