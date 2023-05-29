import { Injectable } from "@angular/core";
import { environment } from 'src/environments/environment';
import { HttpClient } from "@angular/common/http";
import { Observable, Subscription } from "rxjs";
import { Matricula, ResMatricula } from "../class/Matricula";
import { SocketService } from "src/app/services/socket.service";
import { UnAuthorizedService } from "src/app/services/unauthorized.service";
import { ResEstudianteEnGrupo } from "../../grupo/class/EstudianteGrupo";
import { Estudiante } from "../class/Estudiante";

@Injectable({
  providedIn:'root'
})
export class MatriculaService{

  listMatriculados$:Subscription;
  listMatriculados:Matricula[] = [];
  loadingLista:boolean = true;
  respMatricula:ResMatricula;

  constructor(private readonly http:HttpClient,
              private readonly _unAuth:UnAuthorizedService,
              private readonly _scoket:SocketService){
    this.getListaMatriculados();
    this.OnDocentes();
  }

  getAllMatriculados(limit:number = 5, offset:number = 0):Observable<ResMatricula>{
    return this.http.get<ResMatricula>(`${environment.BASE_URL}/matricula/get-prematriculas-estudiantes?limit=${limit}&offset=${offset}`);
  }

  removeMatriculado(Id:number){
    //TODO: falta validar
    return this.http.delete<ResMatricula>(`${environment.BASE_URL}/matricula/remove-fake-matriculado/${Id}`);
  }

  updateMatricula(Id:number, data:Matricula){
    return this.http.patch(`${environment.BASE_URL}/matricula/update-matricula/${Id}`, data);
  }

  updateEstudiante(Id:number, data:Estudiante){
    return this.http.patch(`${environment.BASE_URL}/estudiante/update-estudiante/${Id}`, data);
  }

  addAlumnoEnGrupo(data:any){
    return this.http.post<ResEstudianteEnGrupo>(`${environment.BASE_URL}/estudiante-en-grupo/register-estudiante-prematricula`, data);
  }

  /**
   *
   * Eventos sockets docente
   *
   */

  OnListDocente(){

    return this._scoket.OnEvent('list_matriculados');

  }


  getListaMatriculados(limit:number = 5, offset:number = 0){
    this.loadingLista = true;
    this.listMatriculados$ = this.getAllMatriculados(limit, offset).subscribe({
      next: (value) => {
        this.loadingLista = false;
        if(!value.ok){
          return;
        }
        this.respMatricula = value;
        this.listMatriculados = value.data as Array<Matricula>;
      },
      error: (e) =>{
        this._unAuth.unAuthResponse(e);
        this.loadingLista = false;
      }
    })
  }

  OnDocentes(){
    this.listMatriculados$ = this.OnListDocente().subscribe({
      next: (value) => {
        if(value.ok){
          this.respMatricula = value;
          this.listMatriculados = value.data as Array<Matricula>;
        }
      },
      error: (e) => this._unAuth.unAuthResponse(e)
    })
  }

}
