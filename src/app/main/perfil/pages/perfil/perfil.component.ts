import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { UserLogin } from 'src/app/auth/interfaces/ResLogin';
import { AuthService } from 'src/app/auth/services/auth.service';
import { UsuarioService } from 'src/app/main/usuario/services/usuario.service';
import { UnAuthorizedService } from 'src/app/services/unauthorized.service';
import { SocketService } from 'src/app/services/socket.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {

  /* These lines are declaring two variables `updateUsuario$` and `updatePassword$` of type
  `Subscription`. These variables are used to store the subscription objects returned by the
  `subscribe()` method when making API calls to update the user's personal information and password.
  By storing these subscription objects, the component can later unsubscribe from them in the
  `ngOnDestroy()` method to prevent memory leaks. The `$` symbol at the end of the variable names is
  a convention used in RxJS to indicate that the variable is a subscription object. */
  updateUsuario$:Subscription;
  updatePassword$:Subscription;


  /* These lines are declaring class variables for the `PerfilComponent` Angular component. */
  loadingPassword:boolean;
  loadingUsuario:boolean;
  passwordChangeForm:FormGroup;
  showNewPass:boolean;
  showOldPass:boolean;
  usuario:UserLogin | undefined;
  usuarioForm:FormGroup;

  constructor(public readonly _auth:AuthService,
              private readonly fb:FormBuilder,
              private readonly _unAuth:UnAuthorizedService,
              private readonly _msg:MessageService,
              private readonly _socket:SocketService,
              private readonly _usuario:UsuarioService) {
                this.createFormUsuario();
                this.createFormChangePassword();
              }

  /* `ngOnInit` is a lifecycle hook in Angular that is called after the component has been initialized.
  It is used to perform any initialization logic that the component needs before it is displayed on
  the screen. In this code, `ngOnInit` is initializing some class variables and calling the
  `getUsuario` method to retrieve the user data. */
  ngOnInit(): void {
    this.loadingUsuario = false;
    this.loadingPassword = false;
    this.showNewPass = false;
    this.showOldPass = false;
    this.getUsuario();
  }

  /* `ngOnDestroy` is a lifecycle hook in Angular that is called just before the component is
  destroyed. It is used to perform any cleanup logic that the component needs before it is removed
  from the screen. In this code, `ngOnDestroy` is unsubscribing from any active subscriptions to
  prevent memory leaks. */
  ngOnDestroy(): void {
    if(this.updateUsuario$) this.updateUsuario$.unsubscribe();
    if(this.updatePassword$) this.updatePassword$.unsubscribe();
  }

  /* `createFormUsuario` is a method that creates a `FormGroup` for the user's personal information. It
  sets up the form controls for the user's DNI, names, surnames, email, phone number, and address,
  and applies validators to each control to ensure that the user enters valid data. The method uses
  the `FormBuilder` service to create the form group and its controls. */
  createFormUsuario(){
    this.usuarioForm = this.fb.group({
      DNI:[null, [Validators.required, Validators.pattern(/^([0-9])*$/)]],
      Nombres:[null, [Validators.required, Validators.pattern(/^([a-z ñáéíóú]{2,60})$/i)]],
      ApellidoPaterno:[null, [Validators.required, Validators.pattern(/^([a-z ñáéíóú]{2,60})$/i)]],
      ApellidoMaterno:[null, [Validators.required, Validators.pattern(/^([a-z ñáéíóú]{2,60})$/i)]],
      Email:[null, [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
      Celular:[null, [Validators.required, Validators.pattern(/^([0-9])*$/), Validators.maxLength(9), Validators.minLength(9)]],
      Direccion:[null, Validators.required ]
    })
  }

  /* `createFormChangePassword` is a method that creates a `FormGroup` for changing the user's
  password. It sets up the form controls for the user's current password, new password, and repeat
  password, and applies validators to each control to ensure that the user enters valid data. The
  method uses the `FormBuilder` service to create the form group and its controls. */
  createFormChangePassword(){
    this.passwordChangeForm = this.fb.group({
      CurrentPassword:[null, Validators.required],
      NewPassword:[null, [Validators.required, Validators.pattern(/^(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]{8,}$/)]],
      RepeatPassword:[null, [Validators.required, Validators.pattern(/^(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]{8,}$/)] ]
    })
  }

 /* These are getter methods that return the form controls for the current password, new password, and
 repeat password fields in the `passwordChangeForm` form group. They are used to simplify the code
 and make it easier to access these form controls in other methods of the component. By using these
 getter methods, the form controls can be accessed using dot notation, like `this.CurrentPassword`,
 instead of using the longer syntax `this.passwordChangeForm.controls['CurrentPassword']`. */
  get CurrentPassword(){
    return this.passwordChangeForm.controls['CurrentPassword'];
  }
  get NewPassword(){
    return this.passwordChangeForm.controls['NewPassword'];
  }
  get RepeatPassword(){
    return this.passwordChangeForm.controls['RepeatPassword'];
  }

 /* These are getter methods that return the form controls for the user's personal information fields
 in the `usuarioForm` form group. They are used to simplify the code and make it easier to access
 these form controls in other methods of the component. By using these getter methods, the form
 controls can be accessed using dot notation, like `this.DNI`, instead of using the longer syntax
 `this.usuarioForm.controls['DNI']`. This makes the code more readable and easier to maintain. */
  get DNI(){
    return this.usuarioForm.controls['DNI'];
  }
  get Nombres(){
    return this.usuarioForm.controls['Nombres'];
  }
  get ApellidoPaterno(){
    return this.usuarioForm.controls['ApellidoPaterno'];
  }
  get ApellidoMaterno(){
    return this.usuarioForm.controls['ApellidoMaterno'];
  }
  get Email(){
    return this.usuarioForm.controls['Email'];
  }
  get Celular(){
    return this.usuarioForm.controls['Celular'];
  }
  get Direccion(){
    return this.usuarioForm.controls['Direccion'];
  }

 /**
  * This function retrieves user data and handles errors using authentication and authorization
  * services.
  */
  getUsuario(){
    this._auth.authenticated().subscribe({
      next: (value) => {
        if(!value.ok) return;
        this.usuario = value.user;
        this.completeData(this.usuario);
      },
      error: (e) => {
        console.log(e)
        this.messageError(e);
        this._unAuth.unAuthResponse(e);
      }
    })
  }

  /**
   * The function disables input fields for DNI, names, surnames, and email.
   */
  disableInputs(){
    this.DNI.disable();
    this.Nombres.disable();
    this.ApellidoMaterno.disable();
    this.ApellidoPaterno.disable();
    this.Email.disable();
  }


 /**
  * The function "completeData" sets the values of various form inputs based on the properties of a
  * given user object and disables the inputs.
  * @param {UserLogin} usuario - It is a parameter of type UserLogin, which is an object containing
  * user login information such as DNI, names, surnames, email, phone number, and address. The function
  * `completeData` takes this object as input and sets the corresponding values to the form inputs. It
  * also disables
  */
  completeData(usuario:UserLogin){
    this.DNI.setValue(usuario.DNI)
    this.Nombres.setValue(usuario.Nombres)
    this.ApellidoPaterno.setValue(usuario.ApellidoPaterno)
    this.ApellidoMaterno.setValue(usuario.ApellidoMaterno)
    this.Email.setValue(usuario.Email.toLowerCase())
    this.Celular.setValue(usuario.Celular)
    this.Direccion.setValue(usuario.Direccion)
    this.disableInputs();
  }

/**
 * The function "toast" adds a message with severity, summary, and optional detail to a message
 * service.
 * @param {string} severity - a string indicating the severity level of the message, such as "info",
 * "warn", "error", etc.
 * @param {string} summary - The summary parameter is a string that represents a brief description or
 * title of the message being displayed. It is typically displayed in a larger font or bolded to draw
 * the user's attention.
 * @param {string} [detail] - The `detail` parameter is an optional string parameter that can be passed
 * to the `toast` function. It represents additional information or context that can be displayed along
 * with the summary in the toast message. If no value is provided for `detail`, it will be `undefined`.
 */
  toast(severity:string, summary:string, detail?:string){
    this._msg.add({severity, summary, detail});
  }

  /**
   * This function handles error messages from HTTP responses and displays them as toasts.
   * @param {HttpErrorResponse} e - The parameter "e" is of type HttpErrorResponse, which is an object
   * that contains information about an HTTP error response, including the status code, error message,
   * and any additional error details.
   * @returns If the status code of the HttpErrorResponse is 401, nothing is returned. Otherwise, if
   * the error message is an array, the function will display each error message in a toast with the
   * title "Error de validación de datos". If the error message is not an array, the function will
   * display the error message and the error code in a toast with the title `${e.error.error}:${e.error
   */
  messageError(e:HttpErrorResponse){
    const msg = e.error.message;
    if(e.status==401) return;
    Array.isArray(msg)?msg.forEach((e:string) => this.toast('error', e,'Error de validación de datos')):
                                                 this.toast('error', msg,`${e.error.error}:${e.error.statusCode}`)
  }

  /**
   * This function saves user data if the form is valid, otherwise it marks the invalid inputs as dirty
   * and returns.
   * @returns nothing (undefined). It either executes the code inside the if statement and returns
   * nothing, or it executes the code inside the subscription and returns nothing.
   */
  save(){
    if(this.usuarioForm.invalid){
      Object.keys(this.usuarioForm.controls).forEach( input => this.usuarioForm.controls[input].markAsDirty())
      return;
    }
    this.loadingUsuario = true;
    this.updateUsuario$ = this._usuario.updateUsuario(this.usuario?.Id!, this.usuarioForm.value).subscribe({
      next: (value) => {
        this.loadingUsuario = false;
        if(!value.ok) return;
        this._socket.EmitEvent('updated_list_usuario');
        this.toast('success', value.msg);
      },
      error: (e) => {
        this.loadingUsuario = false;
        this.messageError(e)
        this._unAuth.unAuthResponse(e);
      }
    })
  }

 /**
  * This function saves a new password for a user and performs validation checks.
  * @returns If the passwordChangeForm is invalid, the function returns without doing anything else. If
  * the new passwords do not match, the function returns after displaying a warning message. If the
  * password update is successful, the function displays a success message and resets the
  * passwordChangeForm. If there is an error, the function displays an error message and handles the
  * error.
  */
  savePassword(){
    if(this.passwordChangeForm.invalid){
      Object.keys(this.passwordChangeForm.controls)
            .forEach( input => this.passwordChangeForm.controls[input].markAsDirty())
      return;
    }

    if(this.NewPassword.value!==this.RepeatPassword.value){
      this.toast('warn','Las nuevas contraseñas no coinciden');
      return;
    }

    this.loadingPassword = true;
    this.updatePassword$ = this._usuario.updatePasswordUsuario(this.usuario?.Id!, this.passwordChangeForm.value).subscribe({
      next: (value)=> {
        this.loadingPassword = false;
        if(!value.ok){
          this.toast('error', value.msg)
          return;
        }
        this.toast('success', value.msg);
        this.passwordChangeForm.reset();
      },
      error: (e)=> {
        this.messageError(e)
        this.loadingPassword = false;
        this._unAuth.unAuthResponse(e);
      }
    })
  }

}
