import { environment } from 'src/environments/environment';
import { Injectable } from "@angular/core";
import { Horario, ResHorario } from "../class/Horario";
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AuthService } from "src/app/auth/services/auth.service";
import { Grupo, ResGrupo } from '../class/Grupo';

@Injectable({
  providedIn:"root"
})
export class GrupoService{

  constructor(private _auth:AuthService, private http:HttpClient){}

  /**
   * It returns an HttpHeaders object with the content type set to application/json and the
   * authorization header set to the token retrieved from the local storage.
   * </code>
   * @returns The headers object.
   */
  get headers():HttpHeaders{

    const header = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this._auth.getToken()}`
    });

    return header;
  }

  createHorario(data:Horario):Observable<ResHorario>{
    return this.http.post<ResHorario>(`${environment.BASE_URL}/horario/create-horario`, data, { headers:this.headers });
  }

  createGrupo(data:Grupo):Observable<ResGrupo>{
    return this.http.post<ResGrupo>(`${environment.BASE_URL}/grupo/create-grupo`, data, { headers:this.headers });
  }
}
