import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthService } from "src/app/auth/services/auth.service";
import { environment } from 'src/environments/environment';
import { Curso, ResCurso, ResGetCurso } from "../class/Curso";
import { Observable } from 'rxjs';
import { SocketService } from "src/app/services/socket.service";

@Injectable({
  providedIn:'root'
})
export class CursoService{

  constructor(private http:HttpClient,
              private _auth:AuthService,
              private _socket:SocketService){}

  createCurso(curso:Curso):Observable<ResCurso>{

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this._auth.getToken()}`
    });

    return this.http.post<ResCurso>(`${environment.BASE_URL}/curso/add-curso`,curso, {headers})
  }

  getAllCursos(limit:number = 5, offset:number = 0):Observable<ResGetCurso>{

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this._auth.getToken()}`
    });

    return this.http.get<ResGetCurso>(`${environment.BASE_URL}/curso/get-cursos?limit=${limit}&offset=${offset}`,{ headers });

  }

  /**
   *
   * Escuchando eventos sockets
   *
   */

  OnListaCursos(){

    return this._socket.OnEvent('list_actualizada_cursos');

  }

}
