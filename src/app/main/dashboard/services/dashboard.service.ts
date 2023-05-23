import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { DataHorizontalBar, DataVerticalBar } from "src/app/class/Graphics";
import { SocketService } from "src/app/services/socket.service";
import { UnAuthorizedService } from "src/app/services/unauthorized.service";
import { environment } from 'src/environments/environment';
import { ResGrupo } from "../../grupo/class/Grupo";

@Injectable({
  providedIn:'root'
})
export class DashboardService {

  private BASE_URL:string;


  constructor(private http:HttpClient){
    this.BASE_URL = environment.BASE_URL;

  }

  getDataHorizontalBarEstudinatesEnGrupo(idEstadoGrupo:number){
    return this.http.get<DataHorizontalBar[]>(`${this.BASE_URL}/grupo/get-data-horizontal-bar-estudiantes-grupos/${idEstadoGrupo}`);
  }

  getDataVerticalBarPagosMora(grupoId:number = 1, estadoGrupoId:number = 1){
    return this.http.get<DataVerticalBar[]>(`${this.BASE_URL}/grupo/get-data-vertical-bar-pagos-mora/${grupoId}/${estadoGrupoId}`);
  }

}
