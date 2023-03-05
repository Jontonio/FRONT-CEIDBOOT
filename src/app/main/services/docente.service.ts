import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';

import { AuthService } from "src/app/auth/services/auth.service";
import { Docente, ResDocente, ResGetDocente } from "../class/Docente";
import { SocketService } from 'src/app/services/socket.service';

@Injectable({
  providedIn:'root'
})
export class DocenteService{

  constructor(private http:HttpClient,
              private _auth:AuthService,
              private _socket:SocketService){

                this.OnListDocente();

              }

  /**
   * It returns an HttpHeaders object with the content type set to application/json and the
   * authorization header set to the token retrieved from the local storage.
   * @returns The headers object.
   */
  get headers():HttpHeaders{

    const header = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this._auth.getToken()}`
    });

    return header;
  }

  createDocente(data:Docente):Observable<ResDocente>{
    return this.http.post<ResDocente>(`${environment.BASE_URL}/docente/add-docente`, data, { headers:this.headers });
  }

  getAllDocentes(limit:number = 5, offset:number = 0):Observable<ResGetDocente>{
    return this.http.get<ResGetDocente>(`${environment.BASE_URL}/docente/get-docentes?limit=${limit}&offset=${offset}`,{ headers:this.headers });
  }

  /**
   *
   * Eventos sockets docente
   *
   */

  OnListDocente(){

    return this._socket.OnEvent('list_actualizada_docentes');

  }

}
