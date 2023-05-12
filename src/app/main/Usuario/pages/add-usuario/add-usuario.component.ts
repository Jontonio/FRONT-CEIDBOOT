import { Component, ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { optionOperation } from 'src/app/main/class/global';
import { Usuario } from 'src/app/main/usuario/class/Usuario';
import { SocketService } from 'src/app/services/socket.service';
import { Subscription } from "rxjs";
import { UnAuthorizedService } from 'src/app/services/unauthorized.service';
import { HttpErrorResponse } from '@angular/common/http';
import { FormUsuarioComponent } from '../../components/form-usuario/form-usuario.component';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-add-usuario',
  templateUrl: './add-usuario.component.html',
  styleUrls: ['./add-usuario.component.scss']
})
export class AddUsuarioComponent {

  /* `@ViewChild(FormUsuarioComponent) hijo:FormUsuarioComponent;` is a decorator that allows the
  component to access a child component's properties and methods. In this case, it is used to access
  the `FormUsuarioComponent` component's `resetForm()` method, which is called in the
  `createUsuario()` method to reset the form after a new user is created. The `hijo` variable is
  assigned the instance of the `FormUsuarioComponent` component. */
  @ViewChild(FormUsuarioComponent) hijo:FormUsuarioComponent;

  /* These are properties of the `AddUsuarioComponent` class. */
  loading:boolean;
  tipoOp  :boolean;
  urlLista:string;

  /* These are private properties of the `AddUsuarioComponent` class that hold `Subscription` objects.
  They are used to store the subscriptions returned by the `createUsuario()` and `updateUsuario()`
  methods, respectively. These subscriptions are used to handle the responses from the server when
  creating or updating a user. The `ngOnDestroy()` method is used to unsubscribe from these
  subscriptions when the component is destroyed to prevent memory leaks. */
  private createUsuario$:Subscription;
  private updateUsuario$:Subscription;

  constructor(private readonly route:Router,
              public  readonly _usuario:UsuarioService,
              private readonly _unAuth:UnAuthorizedService,
              private readonly _socket:SocketService,
              private _msg:MessageService) {
                this.urlLista = '/system/usuarios/lista-usuarios';
                this.tipoOp = false;
                this.loading = false;
              }

  /**
   * The function is used to unsubscribe from observables in Angular when the component is destroyed.
   */
  ngOnDestroy(): void {
    if(this.createUsuario$) this.createUsuario$.unsubscribe()
    if(this.updateUsuario$) this.updateUsuario$.unsubscribe()
  }

/**
 * The function "toast" adds a message with severity, summary, and optional detail to a message
 * service.
 * @param {string} severity - a string indicating the severity level of the message, such as "info",
 * "warn", "error", etc.
 * @param {string} summary - The summary parameter is a string that represents a brief description or
 * title of the message being displayed. It is typically displayed in a larger font or bolded to draw
 * the user's attention.
 * @param {string} [detail] - The `detail` parameter is an optional string that provides additional
 * information or context about the message being displayed. If provided, it will be displayed along
 * with the `summary` parameter. If not provided, only the `summary` parameter will be displayed.
 */
  toast(severity:string, summary:string, detail?:string): void{
    this._msg.add({severity, summary, detail});
  }

 /**
  * This function handles HTTP error responses and displays error messages in a toast notification.
  * @param {HttpErrorResponse} e - HttpErrorResponse object, which contains information about the HTTP
  * error that occurred.
  * @returns If the status code of the HttpErrorResponse object is 401, nothing is returned. Otherwise,
  * the function displays an error message using the toast method. If the error message is an array, it
  * displays each element of the array as a separate error message. If the error message is not an
  * array, it displays the error message and the error code and status code from the HttpErrorResponse
  * object.
  */
  messageError(e:HttpErrorResponse): void{
    if(e.status==401) return;
    const msg = e.error.message;
    Array.isArray(msg)?msg.forEach((e:string) => this.toast('error',e,'Error de validación de datos')):
                                                  this.toast('error',msg,`${e.error.error}:${e.error.statusCode}`)
  }

/**
 * This function creates a new user and handles the response accordingly.
 * @param {optionOperation} opt - optionOperation - an object containing data related to the operation
 * being performed on a user. It likely includes a "data" property which is an instance of the
 * "Usuario" class.
 */
  createUsuario(opt:optionOperation): void{
    this.createUsuario$ = this._usuario.createUsuario(opt.data as Usuario).subscribe({
      next: (value) => {
        this.loading = false;
        if(!value.ok){
          this.toast('error', value.msg)
          return;
        }
        this._socket.EmitEvent('updated_list_usuario');
        this.toast('success', value.msg);
        this.hijo.resetForm();
      },
      error: (e) => {
        this.loading = false;
        this.messageError(e);
        this._unAuth.unAuthResponse(e);
      }
    })
  }

  /**
   * This function updates a user and handles success and error responses.
   * @param {optionOperation} opt - An object of type `optionOperation` which contains an `Id` property
   * and a `data` property. The `Id` property is of type `string` and represents the ID of the user to
   * be updated. The `data` property is of type `Usuario` and represents the updated user
   */
  updateUsuario(opt:optionOperation): void{
    this.updateUsuario$ = this._usuario.updateUsuario(opt.Id!, opt.data as Usuario).subscribe({
      next: (value) => {
        this.loading = false;
        if(!value.ok){
          console.log(value)
          this.toast('error', 'Error al actualizar usuario', value.msg)
          return;
        }
        this.toast('success', value.msg);
        this._socket.EmitEvent('updated_list_usuario');
        this.route.navigate([this.urlLista]);
      },
      error: (e) => {
        this.loading = false;
        console.log(e)
        this.messageError(e);
        this._unAuth.unAuthResponse(e);
        this.route.navigate([this.urlLista]);
      }
    })
  }

/**
 * The "save" function updates or creates a user based on the provided options.
 * @param {optionOperation} opt - The parameter "opt" is an object of type "optionOperation". It is
 * likely that this function is part of a larger codebase that uses this object to determine whether to
 * update or create a user. The "loading" property is likely used to indicate that the function is
 * currently processing and to prevent
 */
  save(opt:optionOperation): void{
    this.loading = true;
    console.log(opt)
    opt.option?this.updateUsuario(opt):this.createUsuario(opt)
  }

}
