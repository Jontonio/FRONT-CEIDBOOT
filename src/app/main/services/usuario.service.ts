import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthService } from "src/app/auth/services/auth.service";
import { SocketService } from "src/app/services/socket.service";
import { ResUsuarios, ResUsuario, Usuario } from "../class/Usuario";
import { environment } from 'src/environments/environment';
import { ResRol, Rol } from "src/app/class/Rol";


@Injectable({
  providedIn:"root"
})
export class UsuarioService {

  listUsuarios:Usuario[] = [];

  constructor(private http:HttpClient,
              private _auth:AuthService,
              private _socket:SocketService){ }
  /**
   * It returns an HttpHeaders object with the content type set to application/json and the
   * authorization header set to the token retrieved from the local storage.
   * </code>
   * @returns The headers object.
   */
  get headers():HttpHeaders{

    const header = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this._auth.getToken()}`
    });

    return header;
  }

  getRoles(){
    return this.http.get<ResRol>(`${environment.BASE_URL}/rol`,{ headers:this.headers });
  }

  getAllUsuarios(limit:number = 5, offset:number = 0){
    return this.http.get<ResUsuarios>(`${environment.BASE_URL}/usuario/get-usuarios?limit=${limit}&offset=${offset}`,{ headers:this.headers });
  }

  getUsuario(id:number){
    return this.http.get<ResUsuario>(`${environment.BASE_URL}/usuario/get-one-usuario/${id}`,{ headers:this.headers });
  }

  createUsuario(data:Usuario){
    return this.http.post<ResUsuario>(`${environment.BASE_URL}/usuario/add-usuario`, data, { headers:this.headers });
  }

  updateUsuario(id:number, data:Usuario){
    return this.http.patch<ResUsuario>(`${environment.BASE_URL}/usuario/update-usuario/${id}`, data, { headers:this.headers });
  }

  deleteUsuario(Id:number){
    return this.http.delete<ResUsuario>(`${environment.BASE_URL}/usuario/delete-usuario/${Id}`, { headers:this.headers });
  }

  enableUsuario(Id:number,Habilitado:boolean){
    return this.http.patch<ResUsuario>(`${environment.BASE_URL}/usuario/enable-usuario/${Id}`,{ Habilitado }, { headers:this.headers });
  }

  /**
   *
   * Escuchando eventos sockets
   *
   */

  OnListaCursos(){

    return this._socket.OnEvent('list_actualizada_usuarios');

  }

}
