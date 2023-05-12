import { Component } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { UserLogin } from 'src/app/auth/interfaces/ResLogin';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Usuario } from 'src/app/main/usuario/class/Usuario';
import { SocketService } from 'src/app/services/socket.service';
import { Subscription } from "rxjs";
import { UsuarioService } from '../../services/usuario.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-list-usuario',
  templateUrl: './list-usuario.component.html',
  styleUrls: ['./list-usuario.component.scss']
})
export class ListUsuarioComponent {

  /* These lines are declaring two private variables `enableUser$` and `deleteUser$` of type
  `Subscription`. These variables are used to store the subscription objects returned by the
  `subscribe()` method when subscribing to observables in the component. They are later used in the
  `ngOnDestroy()` method to unsubscribe from the observables and prevent memory leaks. */
  private enableUser$:Subscription;
  private deleteUser$:Subscription;

  /* These lines are declaring three variables `startPage`, `position`, and `imAuth`. */
  startPage:number = 0;
  position :string;
  imAuth   :UserLogin | undefined;
  terminoBusqueda:string;

  constructor(public _usuario:UsuarioService,
              private _socket:SocketService,
              private confirService: ConfirmationService,
              private _msg:MessageService,
              private _auth:AuthService){
                this.imAuth = this._auth.userAuth;
              }


 /**
  * The function is used to unsubscribe from observables in order to prevent memory leaks in a
  * TypeScript component.
  */
  ngOnDestroy(): void {
    if(this.deleteUser$) this.deleteUser$.unsubscribe();
    if(this.enableUser$) this.enableUser$.unsubscribe();
    if(this._usuario.listUsuarios$) this._usuario.listUsuarios$.unsubscribe();
  }

  /**
   * The function paginate() is called when the user clicks on the pagination buttons. The function
   * paginate() calls the function getAllUsuarios() which is defined in the service usuario.service.ts.
   * The function getAllUsuarios() returns an observable which is subscribed to in the function
   * paginate(). The function paginate() then assigns the value of the observable to the variable
   * resUsuarios. The variable resUsuarios is then assigned to the variable listUsuarios. The variable
   * listUsuarios is then used to populate the table
   * @param {any} event - any
   */
  paginate(event:any) {
    this.startPage = event.first;
    this._usuario.getListaUsuarios(event.rows, event.first);
  }

  /**
   * The function receives two parameters, the first is the user object and the second is a boolean
   * that indicates whether the user is enabled or not
   * @param {Usuario} usuario - Usuario, tipoEnable: boolean
   * @param {boolean} tipoEnable - boolean
   */
  Inhabilitar(usuario:Usuario, tipoEnable:boolean){

    this.position = 'top';
    let msgConfirm = (!tipoEnable)?'habilitación':'inhabilitación';
    let msgoptions = (!tipoEnable)?'si':'no';

    this.confirService.confirm({
        message: `¿Está seguro de la ${msgConfirm} al usuario <b>${usuario.Nombres}</b>?<br>
                  una vez confirmado el usuario ${msgoptions} podrá realizar operaciones en el sistema`,
        header: `Confirmación de la ${msgConfirm}`,
        icon: 'pi pi-info-circle',
        accept: () => {
          if(this.imAuth?.Id != usuario.Id){
            this.enableUsuario(usuario);
          }else{
            this.toast('error','Inhabilitación','No se puede realizar la autoinhabilitación');
          }
        },
        reject: (type:any) => {
          console.log("No eliminar");
        },
        key: "enableDialog"
    });
  }

 /**
  * This function enables or disables a user and emits an event to update the user list.
  * @param {Usuario} usuario - The parameter "usuario" is an object of type "Usuario". It is likely
  * that this function is part of a larger codebase that deals with user management, and "Usuario" is a
  * custom class or interface that defines the properties and methods of a user object.
  */
  enableUsuario(usuario:Usuario){
    this.enableUser$ = this._usuario.enableUsuario(usuario.Id!,!usuario.Habilitado).subscribe({
      next: (value) => {
        if(!value.ok){
          return;
        }
        this.toast('success',value.msg);
        this._socket.EmitEvent('updated_list_usuario');
      },
      error: (e) => {
        console.log(e);
        this.messageError(e);
      }
    })
  }

  /**
   * It's a function that receives a user object and displays a confirmation dialog to the user
   * @param {Usuario} usuario - Usuario
   */
  dialogDelete({Nombres, Id}:Usuario) {
    this.position = 'top';
    this.confirService.confirm({
        message: `¿Está seguro de eliminar al usuario <b>${Nombres}</b>?`,
        header: 'Confirmación de eliminar',
        icon: 'pi pi-info-circle',
        accept: () => {
          if(this.imAuth?.Id!=Id){
            this.deleteUsuario(Id!);
          }else{
            this.toast('error','Eliminación','No se puede realizar la autoeliminación');
          }
        },
        reject: (type:any) => {
          console.log("No eliminar");
        },
        key: "deleteUsuarioDialog"
    });
  }

/**
 * This function deletes a user by their ID and emits an event to update the user list.
 * @param {number} Id - The parameter "Id" is a number that represents the unique identifier of a user
 * that needs to be deleted.
 */
  deleteUsuario(Id:number){
    this.deleteUser$ = this._usuario.deleteUsuario(Id!).subscribe({
      next: (value) => {
        if(!value.ok) return;
        this.toast('success','Eliminación',value.msg);
        this._socket.EmitEvent('updated_list_usuario');
      },
      error: (e) => {
        console.log(e);
        this.messageError(e);
      }
    })
  }

  buscarTermino(termino:string){
    this.terminoBusqueda = termino;
  }

  /**
   * The function handles error messages from HTTP responses and displays them as toasts.
   * @param {HttpErrorResponse} e - The parameter "e" is an object of type HttpErrorResponse, which is an
   * Angular class that represents an HTTP response that includes an error status code.
   */
  messageError(e:HttpErrorResponse){
    if(Array.isArray(e.error.message)){
      e.error.message.forEach( (e:string) => {
        this.toast('error',e,'Error de validación de datos')
      })
    }else{
      this.toast('error',e.error.message,`${e.error.error}:${e.error.statusCode}`)
    }
  }

 /**
  * The function adds a message with a specified type, summary, and optional detail to a message list.
  * @param {string} type - The type of the message, which can be one of the following values:
  * "success", "info", "warn", or "error". This determines the color and icon of the message displayed
  * to the user.
  * @param {string} msg - The `msg` parameter is a string that represents the main message or summary
  * of the toast notification. It is used to provide a brief and informative message to the user.
  * @param {string} [detail] - The `detail` parameter is an optional string parameter that provides
  * additional information or context related to the message being displayed. If provided, it will be
  * displayed along with the `summary` message.
  */
  toast(type:string, msg:string, detail?:string){
    this._msg.add({severity:type, summary:msg, detail});
  }

}
