import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { UserLogin } from 'src/app/auth/interfaces/ResLogin';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Usuario } from 'src/app/main/usuario/class/Usuario';
import { SocketService } from 'src/app/services/socket.service';
import { Subscription } from "rxjs";
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-list-usuario',
  templateUrl: './list-usuario.component.html',
  styleUrls: ['./list-usuario.component.scss']
})
export class ListUsuarioComponent {

  // private listUsuarios$  :Subscription;
  private enableUser$    :Subscription;
  private deleteUser$    :Subscription;

  startPage   :number = 0;
  position    :string;
  imAuth      :UserLogin | undefined;


  constructor(public _usuario:UsuarioService,
              private _socket:SocketService,
              private confirService: ConfirmationService,
              private _msg:MessageService,
              private _auth:AuthService,
              private route:Router){

                this.imAuth = this._auth.userAuth;
              }


  ngOnDestroy(): void {
    this._usuario.listUsuarios$.unsubscribe();
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
            this.enableUser$ = this._usuario.enableUsuario(usuario.Id!,!usuario.Habilitado).subscribe({
              next: (value) => {
                if(value.ok){
                  this.toast('success',value.msg);
                  this._socket.EmitEvent('updated_list_usuario');
                }
                this.enableUser$.unsubscribe();
              },
              error: (e) => {
                console.log(e);
                this.messageError(e);
              }
            })
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
            this.deleteUser$ = this._usuario.deleteUsuario(Id!).subscribe({
              next: (value) => {
                if(value.ok){
                  this.toast('success','Eliminación',value.msg);
                  this._socket.EmitEvent('updated_list_usuario');
                }
                this.deleteUser$.unsubscribe();
              },
              error: (e) => {
                console.log(e);
                this.messageError(e);
              }
            })
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

  messageError(e:any){
    if(Array.isArray(e.error.message)){
      e.error.message.forEach( (e:string) => {
        this.toast('error',e,'Error de validación de datos')
      })
    }else{
      this.toast('error',e.error.message,`${e.error.error}:${e.error.statusCode}`)
    }
  }

  /* A function that receives three parameters, the first is the type of message, the second is the
  message and the third is the detail of the message. The function toast() calls the function add()
  of the class MessageService. The function add() is responsible for displaying the message to the
  user. */
  toast(type:string, msg:string, detail:string=''){
    this._msg.add({severity:type, summary:msg, detail});
  }

}
