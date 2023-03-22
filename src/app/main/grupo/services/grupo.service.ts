import { environment } from 'src/environments/environment';
import { Injectable } from "@angular/core";
import { Horario, ResHorario } from "../class/Horario";
import { Observable, Subscription } from 'rxjs';
import { HttpClient } from "@angular/common/http";
import { Grupo, ResGrupo, ResTipoGrupo } from '../class/Grupo';
import { SocketService } from 'src/app/services/socket.service';


@Injectable({
  providedIn:"root"
})
export class GrupoService{

  /** Subscription Variables */
  public listGrupos$:Subscription;
  public onListGrupos$:Subscription;

  /** Variables de clase */
  public listGrupos:Grupo[];
  public loadingLista:boolean;
  public respGrupo:ResGrupo;

  constructor(private http:HttpClient, private _socket:SocketService){
    this.listGrupos = [];
    this.loadingLista = false;
    this.getListaGrupos();
    this.OnListaGrupos();
  }

  createHorario(data:Horario):Observable<ResHorario>{
    return this.http.post<ResHorario>(`${environment.BASE_URL}/horario/create-horario`, data);
  }

  createTipoGrupo(data:Grupo):Observable<ResGrupo>{
    return this.http.post<ResGrupo>(`${environment.BASE_URL}/grupo/create-tipo-grupo`, data);
  }

  createGrupo(data:Grupo):Observable<ResGrupo>{
    return this.http.post<ResGrupo>(`${environment.BASE_URL}/grupo/create-grupo`, data);
  }

  updateGrupo(id:number, data:Grupo):Observable<ResGrupo>{
    return this.http.patch<ResGrupo>(`${environment.BASE_URL}/grupo/update-grupo/${id}`, data);
  }

  getOneGrupo(id:number):Observable<ResGrupo>{
    return this.http.get<ResGrupo>(`${environment.BASE_URL}/grupo/get-one-grupo/${id}`);
  }

  getAllGrupos(limit:number = 5, offset:number = 0):Observable<ResGrupo>{
    return this.http.get<ResGrupo>(`${environment.BASE_URL}/grupo/get-grupos?limit=${limit}&offset=${offset}`);
  }

  getAllTipoGrupos():Observable<ResTipoGrupo>{
    return this.http.get<ResTipoGrupo>(`${environment.BASE_URL}/grupo/get-tipo-grupos`);
  }

  getAllHorarios():Observable<ResHorario>{
    return this.http.get<ResHorario>(`${environment.BASE_URL}/horario/get-horarios`);
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
      error: (err) => {
        console.log("Error lista de usuarios")
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
      error: (e) => console.log(e)
    })
  }

}
