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

  /** Subscription Variables */
  updateUsuario$:Subscription;
  updatePassword$:Subscription;

  /** Variables de clase */
  usuario:UserLogin | undefined;
  loadingUsuario:boolean;
  loadingPassword:boolean;
  usuarioForm:FormGroup;
  passwordChangeForm:FormGroup;

  constructor(public readonly _auth:AuthService,
              private readonly fb:FormBuilder,
              private readonly _unAuth:UnAuthorizedService,
              private readonly _msg:MessageService,
              private readonly _socket:SocketService,
              private readonly _usuario:UsuarioService) {
                this.createFormUsuario();
                this.createFormChangePassword();
              }

  ngOnInit(): void {
    this.loadingUsuario = false;
    this.loadingPassword = false;
    this.getUsuario();
  }

  ngOnDestroy(): void {
    if(this.updateUsuario$) this.updateUsuario$.unsubscribe();
    if(this.updatePassword$) this.updatePassword$.unsubscribe();
  }

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

  createFormChangePassword(){
    this.passwordChangeForm = this.fb.group({
      CurrentPassword:[null, Validators.required],
      NewPassword:[null, [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/)]],
      RepeatPassword:[null, [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/)] ]
    })
  }

  /** Geter passwordChangeForm */
  get CurrentPassword(){
    return this.passwordChangeForm.controls['CurrentPassword'];
  }
  get NewPassword(){
    return this.passwordChangeForm.controls['NewPassword'];
  }
  get RepeatPassword(){
    return this.passwordChangeForm.controls['RepeatPassword'];
  }

  /** Geter usuarioForm */
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

  disableInputs(){
    this.DNI.disable();
    this.Nombres.disable();
    this.ApellidoMaterno.disable();
    this.ApellidoPaterno.disable();
    this.Email.disable();
  }


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

  toast(severity:string, summary:string, detail:string=''){
    this._msg.add({severity, summary, detail});
  }

  messageError(e:HttpErrorResponse){
    const msg = e.error.message;
    if(e.status==401) return;
    Array.isArray(msg)?msg.forEach((e:string) => this.toast('error', e,'Error de validación de datos')):
                                                  this.toast('error', msg,`${e.error.error}:${e.error.statusCode}`)
  }

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
