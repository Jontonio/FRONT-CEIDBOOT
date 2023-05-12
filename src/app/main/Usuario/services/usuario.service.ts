import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { SocketService } from "src/app/services/socket.service";
import { ResUsuario, Usuario } from "../class/Usuario";
import { environment } from 'src/environments/environment';
import { ResRol } from "src/app/auth/class/Rol";
import { Subscription } from 'rxjs';
import { UnAuthorizedService } from "src/app/services/unauthorized.service";

@Injectable({
  providedIn:"root"
})
export class UsuarioService {

  /* These are properties of the `UsuarioService` class in an Angular application. */
  public listUsuarios$:Subscription;
  public onListUsuarios$:Subscription;

  public listUsuarios:Usuario[] = [];
  public loadingLista:boolean = false;
  public respUsuario  :ResUsuario | undefined;

  constructor(private http:HttpClient,
              private readonly _unAuth:UnAuthorizedService,
              private _socket:SocketService){
    this.getListaUsuarios();
    this.OnListaUsuarios();
  }

 /**
  * This function sends an HTTP GET request to retrieve a list of roles from a specified URL.
  * @returns The `getRoles()` function is returning an HTTP GET request to the `/rol` endpoint of the
  * `environment.BASE_URL`. The response is expected to be of type `ResRol`.
  */
  getRoles(){
    return this.http.get<ResRol>(`${environment.BASE_URL}/rol`);
  }

  /**
   * This function retrieves a list of users with a specified limit and offset from a server using HTTP
   * GET request in TypeScript.
   * @param {number} [limit=5] - The maximum number of usuarios to retrieve in a single request. The
   * default value is 5 if no value is provided.
   * @param {number} [offset=0] - The offset parameter is used to specify the starting point of the data
   * to be retrieved. It determines the number of items to skip before starting to return data. In the
   * given code, it is used to skip the first 'offset' number of items and start retrieving data from the
   * next item.
   * @returns A GET request to the specified URL with a limit and offset parameter, which returns a
   * response of type ResUsuario.
   */
  getAllUsuarios(limit:number = 5, offset:number = 0){
    return this.http.get<ResUsuario>(`${environment.BASE_URL}/usuario/get-usuarios?limit=${limit}&offset=${offset}`);
  }

  /**
   * This function retrieves a single user from a server using their ID.
   * @param {number} id - The parameter "id" is a number that represents the unique identifier of a
   * user. This function uses this parameter to make an HTTP GET request to the server to retrieve the
   * user information with the specified ID.
   * @returns The function `getUsuario` is returning an HTTP GET request to the server to retrieve a
   * single user with the specified `id`. The response is expected to be of type `ResUsuario`, which is
   * likely a custom interface or class defined elsewhere in the codebase.
   */
  getUsuario(id:number){
    return this.http.get<ResUsuario>(`${environment.BASE_URL}/usuario/get-one-usuario/${id}`);
  }

/**
 * This function sends a POST request to add a new user to the server.
 * @param {Usuario} data - The data parameter is an object of type Usuario that contains information
 * about a user. This object is passed as the body of a POST request to the specified URL.
 * @returns The `createUsuario` function is returning an HTTP POST request to add a new user to the
 * server. The request is sent to the URL `${environment.BASE_URL}/usuario/add-usuario` with the data
 * of the new user passed as a parameter. The response from the server is expected to be of type
 * `ResUsuario`.
 */
  createUsuario(data:Usuario){
    return this.http.post<ResUsuario>(`${environment.BASE_URL}/usuario/add-usuario`, data);
  }

/**
 * This function sends a PATCH request to update a user's data using their ID and new information.
 * @param {number} id - A number representing the ID of the user to be updated.
 * @param {Usuario} data - The `data` parameter is of type `Usuario`, which is likely an interface or
 * class representing a user object with properties such as name, email, password, etc. This parameter
 * is used to update an existing user's information in the database.
 * @returns an HTTP PATCH request to update a user with the specified ID and data, and it expects to
 * receive a response of type ResUsuario.
 */
  updateUsuario(id:number, data:Usuario){
    return this.http.patch<ResUsuario>(`${environment.BASE_URL}/usuario/update-usuario/${id}`, data);
  }

/**
 * This function sends a PATCH request to update the password of a user with the specified ID using the
 * provided data.
 * @param {number} id - The ID of the user whose password needs to be updated.
 * @param {any} data - The `data` parameter is of type `any`, which means it can be any data type.
 * However, based on the function name and endpoint URL, it is likely that the `data` parameter
 * contains the new password for a user with the specified `id`.
 * @returns an HTTP PATCH request to update the password of a user with the specified ID, using the
 * data provided in the request body. The response is expected to be of type ResUsuario, which is
 * likely a custom interface or type defined in the codebase.
 */
  updatePasswordUsuario(id:number, data:any){
    return this.http.patch<ResUsuario>(`${environment.BASE_URL}/usuario/update-password-usuario/${id}`, data);
  }

/**
 * This function sends a DELETE request to the server to delete a user with a specific ID.
 * @param {number} Id - The parameter "Id" is a number that represents the unique identifier of the
 * user that needs to be deleted from the database.
 * @returns The `deleteUsuario` function is returning an HTTP DELETE request to the specified URL with
 * the given `Id` parameter. The response is expected to be of type `ResUsuario`.
 */
  deleteUsuario(Id:number){
    return this.http.delete<ResUsuario>(`${environment.BASE_URL}/usuario/delete-usuario/${Id}`);
  }

/**
 * This function enables or disables a user account by sending a PATCH request to the server.
 * @param {number} Id - The ID of the user whose account is being enabled or disabled.
 * @param {boolean} Habilitado - A boolean value indicating whether the user should be enabled or
 * disabled. If Habilitado is true, the user will be enabled. If Habilitado is false, the user will be
 * disabled.
 * @returns an HTTP PATCH request to the specified URL with the provided Id and Habilitado parameters
 * in the request body. The response is expected to be of type ResUsuario.
 */
  enableUsuario(Id:number,Habilitado:boolean){
    return this.http.patch<ResUsuario>(`${environment.BASE_URL}/usuario/enable-usuario/${Id}`,{ Habilitado });
  }


/**
 * This function listens for the 'list_usuarios' event on a socket connection.
 * @returns The method `OnCursos` is returning the result of calling the `OnEvent` method of the
 * `_socket` object with the argument `'list_usuarios'`. It is not clear what the `OnEvent` method does
 * or what the expected result is, so it is difficult to determine exactly what is being returned.
 */
  OnCursos(){
    return this._socket.OnEvent('list_usuarios');
  }

/**
 * This function retrieves a list of users with a specified limit and offset, and handles loading and
 * error states.
 * @param {number} [limit=5] - The maximum number of items to retrieve in the list of users.
 * @param {number} [offset=0] - The offset parameter is used to specify the starting point of the data
 * to be retrieved. It determines the number of items to skip before starting to return data. In this
 * case, it is set to 0 by default, meaning that the data retrieval will start from the beginning.
 * However, it can be
 */
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
      error: (e) => {
        this._unAuth.unAuthResponse(e);
        this.loadingLista = false;
      }
    })
  }

  /**
   * The function retrieves a list of users from a server and stores it in a variable.
   */
  OnListaUsuarios(){
    this.onListUsuarios$ = this.OnCursos().subscribe({
      next: (value) => {
        if(value.ok){
          this.respUsuario = value;
          this.listUsuarios = value.data as Array<Usuario>;
        }
      },
      error: (e) => this._unAuth.unAuthResponse(e)
    })
  }


}
