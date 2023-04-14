import { Component, ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { optionOperation } from 'src/app/main/class/global';
import { Usuario } from 'src/app/main/usuario/class/Usuario';
import { SocketService } from 'src/app/services/socket.service';
import { Subscription } from "rxjs";
import { UsuarioService } from '../../services/usuario.service';
import { FormUsuarioComponent } from '../../components/form-usuario/form-usuario.component';
import { UnAuthorizedService } from 'src/app/services/unauthorized.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-add-usuario',
  templateUrl: './add-usuario.component.html',
  styleUrls: ['./add-usuario.component.scss']
})
export class AddUsuarioComponent {

  /** variables ViewChild */
  @ViewChild(FormUsuarioComponent) hijo:FormUsuarioComponent;

  /** Variables de clase */
  loading:boolean;
  tipoOp  :boolean;
  urlLista:string;

  private createUsuario$:Subscription;
  private updateUsuario$:Subscription;

  constructor(private route:Router,
              public _usuario:UsuarioService,
              private readonly _unAuth:UnAuthorizedService,
              private _socket:SocketService,
              private _msg:MessageService) {
                this.urlLista = '/system/usuarios/lista-usuarios';
                this.tipoOp = false;
                this.loading = false;
              }

  ngOnDestroy(): void {
    if(this.createUsuario$) this.createUsuario$.unsubscribe()
    if(this.updateUsuario$) this.updateUsuario$.unsubscribe()
  }

  toast(severity:string, summary:string, detail:string=''){
    this._msg.add({severity, summary, detail});
  }

  messageError(e:HttpErrorResponse){
    if(e.status==401) return;
    const msg = e.error.message;
    Array.isArray(msg)?msg.forEach((e:string) => this.toast('error',e,'Error de validación de datos')):
                                                  this.toast('error',msg,`${e.error.error}:${e.error.statusCode}`)
  }

  createUsuario(opt:optionOperation){
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

  updateUsuario(opt:optionOperation){
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

  save(opt:optionOperation){
    this.loading = true;
    opt.option?this.updateUsuario(opt):this.createUsuario(opt)
  }

}
