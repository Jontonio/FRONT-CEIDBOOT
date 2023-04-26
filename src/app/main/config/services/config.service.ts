import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { EstadoGrupo, ResEstadoGrupo } from "../../grupo/class/EstadoGrupo";
import { Observable } from 'rxjs';
import { environment } from "src/environments/environment";

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

}
