import { environment } from 'src/environments/environment';
import { Injectable } from "@angular/core";
import { Horario, ResHorario } from "../class/Horario";
import { Observable, Subscription } from 'rxjs';
import { HttpClient } from "@angular/common/http";
import { Grupo, ResGrupo, ResTipoGrupo } from '../class/Grupo';
import { SocketService } from 'src/app/services/socket.service';
import { UnAuthorizedService } from 'src/app/services/unauthorized.service';
import { ResEstadoEstudEnGrupo, ResEstudianteEnGrupo } from '../class/EstudianteGrupo';
import { Pago, ResPago } from '../class/Pago';
import { ResEstadoGrupo } from '../class/EstadoGrupo';


@Injectable({
  providedIn:"root"
})
export class GrupoService{

  /** variable privada  */
  private BASE_URL:string;

  /** Subscription Variables */
  public listGrupos$:Subscription;
  public onListGrupos$:Subscription;

  /** Variables de clase */
  public listGrupos:Grupo[];
  public loadingLista:boolean;
  public respGrupo:ResGrupo;

  constructor(private http:HttpClient,
              private _unAuth:UnAuthorizedService,
              private _socket:SocketService){
    this.BASE_URL = environment.BASE_URL;
    this.listGrupos = [];
    this.loadingLista = false;
    this.getListaGrupos();
    this.OnListaGrupos();
  }

  createHorario(data:Horario):Observable<ResHorario>{
    return this.http.post<ResHorario>(`${this.BASE_URL}/horario/create-horario`, data);
  }

  createTipoGrupo(data:Grupo):Observable<ResGrupo>{
    return this.http.post<ResGrupo>(`${this.BASE_URL}/grupo/create-tipo-grupo`, data);
  }

  createGrupo(data:Grupo):Observable<ResGrupo>{
    return this.http.post<ResGrupo>(`${this.BASE_URL}/grupo/create-grupo`, data);
  }

  updateGrupo(id:number, data:Grupo):Observable<ResGrupo>{
    return this.http.patch<ResGrupo>(`${this.BASE_URL}/grupo/update-grupo/${id}`, data);
  }

  getOneGrupo(id:number):Observable<ResGrupo>{
    return this.http.get<ResGrupo>(`${this.BASE_URL}/grupo/get-one-grupo/${id}`);
  }

  getAllGrupos(limit:number = 5, offset:number = 0):Observable<ResGrupo>{
    return this.http.get<ResGrupo>(`${this.BASE_URL}/grupo/get-grupos?limit=${limit}&offset=${offset}`);
  }

  getAllTipoGrupos():Observable<ResTipoGrupo>{
    return this.http.get<ResTipoGrupo>(`${this.BASE_URL}/grupo/get-tipo-grupos`);
  }

  getAllEstadoGrupo():Observable<ResEstadoGrupo>{
    return this.http.get<ResEstadoGrupo>(`${this.BASE_URL}/estado-grupo/get-lista-estados`);
  }

  getAllHorarios():Observable<ResHorario>{
    return this.http.get<ResHorario>(`${this.BASE_URL}/horario/get-horarios`);
  }

  getEstudiantesEnGrupoEspecifico(Id:string, limit:number = 5, offset:number = 0):Observable<ResEstadoEstudEnGrupo>{
    return this.http.get<ResEstadoEstudEnGrupo>(`${this.BASE_URL}/estudiante-en-grupo/get-estudiantes-en-grupo-especifico/${Id}?limit=${limit}&offset=${offset}`);
  }

  updatePago(id:string, pago:Pago):Observable<ResPago>{
    return this.http.patch<ResPago>(`${this.BASE_URL}/pago/update-one-pago/${id}`, pago);
  }

  /** Listen Sockets */

  OnGrupos(){
    return this._socket.OnEvent('list_grupos');
  }

  OnHorarios(){
    return this._socket.OnEvent('list_horarios');
  }

  OnTNombresGrupos(){
    return this._socket.OnEvent('list_tNombre_grupos');
  }

  getListaGrupos(limit:number = 5, offset:number = 0){
    this.loadingLista = true;
    this.listGrupos$ = this.getAllGrupos(limit, offset).subscribe({
      next: (value) => {
        this.loadingLista = false;
        if(!value.ok) return;
        this.respGrupo = value;
        this.listGrupos = value.data as Array<Grupo>;
      },
      error: (e) => {
        this._unAuth.unAuthResponse(e);
        this.loadingLista = false;
      }
    })
  }

  OnListaGrupos(){
    this.onListGrupos$ = this.OnGrupos().subscribe({
      next: (value) => {
        if(value.ok){
          this.respGrupo = value;
          this.listGrupos = value.data as Array<Grupo>;
        }
      },
      error: (e) => this._unAuth.unAuthResponse(e)
    })
  }


}
