import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from 'src/environments/environment';
import { Curso, ResCurso } from "../class/Curso";
import { Observable, Subscription } from 'rxjs';
import { SocketService } from "src/app/services/socket.service";
import { ResNivel } from "../class/Nivel";
import { UnAuthorizedService } from "src/app/services/unauthorized.service";
import { Libro, ResLibro } from "../class/Libro";
import { LintResult } from "tslint";
import { ResModulo } from "../class/Modulo";

@Injectable({
  providedIn:'root'
})
export class CursoService{

  private BASE_URL:string;

  public listCursos$:Subscription;
  public onListCursos$:Subscription;

  public respCurso :ResCurso;
  public listCursos:Curso[] = [];
  public loadingLista:boolean = false;

  constructor(private http:HttpClient,
              private _unAuth:UnAuthorizedService,
              private _socket:SocketService){
                this.BASE_URL = environment.BASE_URL;
                this.getListaCursos();
                this.OnListaCursos();
              }

  createCurso(curso:Curso):Observable<ResCurso>{
    return this.http.post<ResCurso>(`${this.BASE_URL}/curso/add-curso`, curso )
  }

  createLibro(libro:Libro):Observable<ResLibro>{
    return this.http.post<ResLibro>(`${this.BASE_URL}/libro/register-libro`, libro )
  }

  getAllCursos(limit:number = 5, offset:number = 0):Observable<ResCurso>{
    return this.http.get<ResCurso>(`${this.BASE_URL}/curso/get-cursos?limit=${limit}&offset=${offset}`);
  }

  getAllModulos():Observable<ResModulo>{
    return this.http.get<ResModulo>(`${this.BASE_URL}/curso/get-modulos`);
  }

  getAllNiveles(limit:number = 10, offset:number = 0):Observable<ResNivel>{
    return this.http.get<ResNivel>(`${this.BASE_URL}/nivel/get-all-niveles?limit=${limit}&offset=${offset}`);
  }

  getAllListCursos():Observable<ResCurso>{
    return this.http.get<ResCurso>(`${this.BASE_URL}/curso/get-cursos`);
  }

  getOneLibro(Id:number | string):Observable<ResLibro>{
    return this.http.get<ResLibro>(`${this.BASE_URL}/libro/get-one-libro/${Id}`);
  }

  deleteCurso(Id:number):Observable<ResCurso>{
    return this.http.delete<ResCurso>(`${this.BASE_URL}/curso/delete-curso/${Id}`);
  }

  getOneCursoById(Id:number):Observable<ResCurso>{
    return this.http.get<ResCurso>(`${this.BASE_URL}/curso/get-one-curso/${Id}`);
  }

  updateCurso(id:number, data:Curso):Observable<ResCurso>{
    return this.http.patch<ResCurso>(`${this.BASE_URL}/curso/update-curso/${id}`, data);
  }

  updateLibro(id:string, data:Libro):Observable<ResLibro>{
    return this.http.patch<ResLibro>(`${this.BASE_URL}/libro/update-libro/${id}`, data);
  }

  deleteLibro(id:string):Observable<ResLibro>{
    return this.http.delete<ResLibro>(`${this.BASE_URL}/libro/delete-libro/${id}`);
  }

  /** Escuchando eventos sockets */

  OnCursos(){
    return this._socket.OnEvent('list_cursos');
  }

  getListaCursos(limit:number = 5, offset:number = 0){
    this.loadingLista = true;
    this.listCursos$ = this.getAllCursos(limit, offset).subscribe({
      next: (value) => {
        this.loadingLista = false;
        if(value.ok){
          this.respCurso = value;
          this.listCursos = value.data as Array<Curso>;
        }
      },
      error: (e) => {
        this.loadingLista = false;
        this._unAuth.unAuthResponse(e);
      }
    })
  }

  OnListaCursos(){
    this.onListCursos$ = this.OnCursos().subscribe({
      next: (value) => {
        if(value.ok){
          this.respCurso = value;
          this.listCursos = value.data as Array<Curso>;
        }
      },
      error: (e) => this._unAuth.unAuthResponse(e)
    })
  }

}
