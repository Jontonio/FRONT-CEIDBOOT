import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResTramite, Tramite } from 'src/app/class/Tramite';
import { SocketService } from 'src/app/services/socket.service';
import { UnAuthorizedService } from 'src/app/services/unauthorized.service';
import { environment } from 'src/environments/environment';
import { Observable, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TramiteService {

  /** variable privada  */
  private BASE_URL:string;
  /** Variables de clase */
  public listTramites:Tramite[] = [];
  respTramite:ResTramite;
  loadingLista:boolean = false;
  listTramites$:Subscription;
  onListGrupos$:Subscription;

  constructor(private http:HttpClient,
    private _unAuth:UnAuthorizedService,
    private _socket:SocketService){
    this.BASE_URL = environment.BASE_URL;
    this.getListaTramites();
    this.OnListaGrupos();
  }

  getAllTramites(limit:number = 5, offset:number = 0){
    return this.http.get<ResTramite>(`${this.BASE_URL}/tramite/get-all-tramites?limit=${limit}&offset=${offset}`);
  }

  deleteTramite(Id:number){
    return this.http.delete<ResTramite>(`${this.BASE_URL}/tramite/delete-tramite/${Id}`);
  }

  getListaTramites(limit:number = 5, offset:number = 0){
    this.loadingLista = true;
    this.listTramites$ = this.getAllTramites(limit, offset).subscribe({
      next: (value) => {
        this.loadingLista = false;
        if(!value.ok) return;
        this.respTramite = value;
        this.listTramites = value.data as Array<Tramite>;
      },
      error: (e) => {
        this._unAuth.unAuthResponse(e);
        this.loadingLista = false;
      }
    })
  }

  OnGrupos(){
    return this._socket.OnEvent('list_tramites');
  }

  OnListaGrupos(){
    this.onListGrupos$ = this.OnGrupos().subscribe({
      next: (value) => {
        if(value.ok){
          this.respTramite = value;
          this.listTramites = value.data as Array<Tramite>;
        }
      },
      error: (e) => this._unAuth.unAuthResponse(e)
    })
  }

}
