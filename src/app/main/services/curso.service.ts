import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from 'src/environments/environment';
import { Curso, ResCurso } from "../class/Curso";
import { Observable, Subscription } from 'rxjs';
import { SocketService } from "src/app/services/socket.service";

@Injectable({
  providedIn:'root'
})
export class CursoService{

  public listCursos$:Subscription;
  public onListCursos$:Subscription;

  public respCurso :ResCurso;
  public listCursos:Curso[] = [];
  public loadingLista:boolean = false;

  constructor(private http:HttpClient,
              private _socket:SocketService){
                this.getListaCursos();
                this.OnListaCursos();
              }

  createCurso(curso:Curso):Observable<ResCurso>{
    return this.http.post<ResCurso>(`${environment.BASE_URL}/curso/add-curso`, curso )
  }

  getAllCursos(limit:number = 5, offset:number = 0):Observable<ResCurso>{
    return this.http.get<ResCurso>(`${environment.BASE_URL}/curso/get-cursos?limit=${limit}&offset=${offset}`);
  }

  getAllListCursos():Observable<ResCurso>{
    return this.http.get<ResCurso>(`${environment.BASE_URL}/curso/get-cursos`);
  }

  deleteCurso(Id:number):Observable<ResCurso>{
    return this.http.delete<ResCurso>(`${environment.BASE_URL}/curso/delete-curso/${Id}`);
  }

  getOneCursoById(Id:number):Observable<ResCurso>{
    return this.http.get<ResCurso>(`${environment.BASE_URL}/curso/get-one-curso/${Id}`);
  }

  updateCurso(id:number, data:Curso){
    return this.http.patch<ResCurso>(`${environment.BASE_URL}/curso/update-curso/${id}`, data);
  }

  /**
   *
   * Escuchando eventos sockets
   *
   */

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
      error: (err) => {
        console.log("Error lista cursos")
        this.loadingLista = false;
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
      error: (e) => console.log(e)
    })
  }

}
