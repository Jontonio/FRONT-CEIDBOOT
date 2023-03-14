import { environment } from 'src/environments/environment';
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, Subscription } from 'rxjs';

import { Docente, ResDocente } from "../class/Docente";
import { SocketService } from 'src/app/services/socket.service';


@Injectable({
  providedIn:'root'
})
export class DocenteService{

  public listDocentes$:Subscription;
  public onListDocentes$:Subscription;

  public respDocente :ResDocente | undefined;
  public listDocentes:Docente[] = [];
  public loadingLista:boolean = false;

  constructor(private http:HttpClient,
              private _socket:SocketService){
                this.getListaDocentes();
                this.OnDocentes();
              }

  createDocente(data:Docente):Observable<ResDocente>{
    return this.http.post<ResDocente>(`${environment.BASE_URL}/docente/add-docente`, data);
  }

  getAllDocentes(limit:number = 5, offset:number = 0):Observable<ResDocente>{
    return this.http.get<ResDocente>(`${environment.BASE_URL}/docente/get-docentes?limit=${limit}&offset=${offset}`);
  }

  getAllListDocentes():Observable<ResDocente>{
    return this.http.get<ResDocente>(`${environment.BASE_URL}/docente/get-docentes`);
  }

  getOneDocenteById(Id:number){
    return this.http.get<ResDocente>(`${environment.BASE_URL}/docente/get-one-docente/${Id}`);
  }

  updateDocente(id:number, data:Docente){
    return this.http.patch<ResDocente>(`${environment.BASE_URL}/docente/update-docente/${id}`, data);
  }

  deleteDocente(Id:number){
    return this.http.delete<ResDocente>(`${environment.BASE_URL}/docente/delete-docente/${Id}`);
  }

  /**
   *
   * Eventos sockets docente
   *
   */

  OnListDocente(){

    return this._socket.OnEvent('list_docentes');

  }

  getListaDocentes(limit:number = 5, offset:number = 0){
    this.loadingLista = true;
    this.listDocentes$ = this.getAllDocentes(limit, offset).subscribe({
      next: (value) => {
        this.loadingLista = false;
        if(value.ok){
          this.respDocente = value;
          this.listDocentes = value.data as Array<Docente>;
        }
      },
      error: (err) => {
        console.log("Error lista docentes")
        this.loadingLista = false;
      }
    })
  }

  OnDocentes(){
    this.onListDocentes$ = this.OnListDocente().subscribe({
      next: (value) => {
        if(value.ok){
          this.respDocente = value;
          this.listDocentes = value.data as Array<Docente>;
        }
      },
      error: (e) => console.log(e)
    })
  }

}
