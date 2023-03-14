import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { SocketService } from "src/app/services/socket.service";
import { ResUsuario, Usuario } from "../class/Usuario";
import { environment } from 'src/environments/environment';
import { ResRol } from "src/app/class/Rol";
import { Subscription } from 'rxjs';

@Injectable({
  providedIn:"root"
})
export class UsuarioService {

  public listUsuarios$:Subscription;
  public onListUsuarios$:Subscription;

  public listUsuarios:Usuario[] = [];
  public loadingLista:boolean = false;
  public respUsuario  :ResUsuario | undefined;

  constructor(private http:HttpClient, private _socket:SocketService){
    this.getListaUsuarios();
    this.OnListaUsuarios();
  }

  getRoles(){
    return this.http.get<ResRol>(`${environment.BASE_URL}/rol`);
  }

  getAllUsuarios(limit:number = 5, offset:number = 0){
    return this.http.get<ResUsuario>(`${environment.BASE_URL}/usuario/get-usuarios?limit=${limit}&offset=${offset}`);
  }

  getUsuario(id:number){
    return this.http.get<ResUsuario>(`${environment.BASE_URL}/usuario/get-one-usuario/${id}`);
  }

  createUsuario(data:Usuario){
    return this.http.post<ResUsuario>(`${environment.BASE_URL}/usuario/add-usuario`, data);
  }

  updateUsuario(id:number, data:Usuario){
    return this.http.patch<ResUsuario>(`${environment.BASE_URL}/usuario/update-usuario/${id}`, data);
  }

  deleteUsuario(Id:number){
    return this.http.delete<ResUsuario>(`${environment.BASE_URL}/usuario/delete-usuario/${Id}`);
  }

  enableUsuario(Id:number,Habilitado:boolean){
    return this.http.patch<ResUsuario>(`${environment.BASE_URL}/usuario/enable-usuario/${Id}`,{ Habilitado });
  }

  /**
   *
   * Escuchando eventos sockets
   *
   */

  OnCursos(){
    return this._socket.OnEvent('list_usuarios');
  }

  getListaUsuarios(limit:number = 5, offset:number = 0){
    this.loadingLista = true;
    this.listUsuarios$ = this.getAllUsuarios(limit, offset).subscribe({
      next: (value) => {
        this.loadingLista = false;
        if(value.ok){
          this.respUsuario = value;
          this.listUsuarios = value.data as Array<Usuario>;
        }
      },
      error: (err) => {
        console.log("Error lista de usuarios")
        this.loadingLista = false;
      }
    })
  }

  OnListaUsuarios(){
    this.onListUsuarios$ = this.OnCursos().subscribe({
      next: (value) => {
        if(value.ok){
          this.respUsuario = value;
          this.listUsuarios = value.data as Array<Usuario>;
        }
      },
      error: (e) => console.log(e)
    })
  }


}
