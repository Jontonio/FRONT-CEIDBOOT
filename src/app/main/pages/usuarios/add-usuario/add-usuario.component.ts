import { Component, OnInit, ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { optionOperation, Usuario } from 'src/app/main/class/Usuario';
import { FormUsuarioComponent } from 'src/app/main/components/form-usuario/form-usuario.component';
import { UsuarioService } from 'src/app/main/services/usuario.service';
import { GlobalService } from 'src/app/services/global.service';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-add-usuario',
  templateUrl: './add-usuario.component.html',
  styleUrls: ['./add-usuario.component.scss']
})
export class AddUsuarioComponent {

  @ViewChild(FormUsuarioComponent) hijo:FormUsuarioComponent;
  loadding:boolean = false;
  tipoOp  :boolean = false;

  constructor(private route:Router,
              public _usuario:UsuarioService,
              private _global:GlobalService,
              private _socket:SocketService,
              private _msg:MessageService) {

              this._global.parseURL(this.route);
  }

  save(data:optionOperation){

    this.loadding = true;

    if(!data.option){

      this._usuario.createUsuario(data.data).subscribe({
        next: (value) => {

          this.loadding = false;
          if(value.ok){
            this._socket.EmitEvent('Nuevo_usuario');
            this.toast('success', value.msg);
            this.hijo.FormUsuario.reset();
          }else{
            this.toast('error', value.msg)
          }

        },
        error: (err) => {
          this.loadding = false;
          err.error.message.forEach( (err:string) => {
            this.toast('error',err,'Error al registrar los datos')
          })
        },
      })

    }else{

      this._usuario.updateUsuario(data.Id!, data.data).subscribe({

        next: (value) => {

          this.loadding = false;
          if(value.ok){
            this._socket.EmitEvent('Nuevo_usuario');
            this.toast('success', value.msg);
            this.hijo.FormUsuario.reset();
          }else{
            this.toast('error','Error al actualizar usuario',value.msg)
          }

        },
        error: (err) => {
          console.log(err);
          this.loadding = false;
          err.error.message.forEach( (err:string) => {
            this.toast('error',err,'Error al registrar los datos')
          })
        },
      })

    }

  }

  stateOp(tipo:boolean){
    console.log(tipo);
  }

  toast(type:string, msg:string, detail:string=''){
    this._msg.add({severity:type, summary:msg, detail});
  }

}
