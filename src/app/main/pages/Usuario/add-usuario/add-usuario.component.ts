import { Component, ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { optionOperation } from 'src/app/main/class/global';
import { Usuario } from 'src/app/main/class/Usuario';
import { FormUsuarioComponent } from 'src/app/main/components/form-usuario/form-usuario.component';
import { UsuarioService } from 'src/app/main/services/usuario.service';
import { GlobalService } from 'src/app/services/global.service';
import { SocketService } from 'src/app/services/socket.service';
import { Subscription } from "rxjs";

@Component({
  selector: 'app-add-usuario',
  templateUrl: './add-usuario.component.html',
  styleUrls: ['./add-usuario.component.scss']
})
export class AddUsuarioComponent {

  @ViewChild(FormUsuarioComponent) hijo:FormUsuarioComponent;
  loadding:boolean = false;
  tipoOp  :boolean = false;
  urlLista:string = '/system/usuarios/lista-usuarios';

  private createUsuario$:Subscription;
  private updateUsuario$:Subscription;

  constructor(private route:Router,
              public _usuario:UsuarioService,
              private _global:GlobalService,
              private _socket:SocketService,
              private _msg:MessageService) {

              this._global.parseURL(this.route);
  }

  save(data:optionOperation){
    this.loadding = true;
    if(data.option){
      this.updateUsuario$ = this._usuario.updateUsuario(data.Id!, data.data as Usuario).subscribe({
        next: (value) => {
          this.loadding = false;
          if(value.ok){
            this._socket.EmitEvent('updated_list_usuario');
            this.toast('success', value.msg);
            this.route.navigate([this.urlLista]);
          }else{
            this.toast('error','Error al actualizar usuario',value.msg)
          }
          this.updateUsuario$.unsubscribe();
        },
        error: (e) => {
          this.loadding = false;
          this.route.navigate([this.urlLista]);
          this.messageError(e);
        },
      })
    }else{
      this.createUsuario$ = this._usuario.createUsuario(data.data as Usuario).subscribe({
        next: (value) => {
          this.loadding = false;
          if(value.ok){
            this._socket.EmitEvent('updated_list_usuario');
            this.toast('success', value.msg);
            this.hijo.resetForm();
          }else{
            this.toast('error', value.msg)
          }
          this.createUsuario$.unsubscribe();
        },
        error: (err) => {
          this.loadding = false;
          err.error.message.forEach( (err:string) => {
            this.toast('error',err,'Error al registrar los datos')
          })
        },
      })
    }
  }

  messageError(e:any){
    if(Array.isArray(e.error.message)){
      e.error.message.forEach( (e:string) => {
        this.toast('error',e,'Error de validación de datos')
      })
    }else{
      this.toast('error',e.error.message,`${e.error.error}:${e.error.statusCode}`)
    }
  }

  toast(type:string, msg:string, detail:string=''){
    this._msg.add({severity:type, summary:msg, detail});
  }

}
