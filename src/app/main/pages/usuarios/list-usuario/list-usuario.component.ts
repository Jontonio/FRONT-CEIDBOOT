import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, ConfirmEventType, MessageService } from 'primeng/api';
import { LoginUser } from 'src/app/auth/interfaces/ResLogin';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ResUsuarios, Usuario } from 'src/app/main/class/Usuario';
import { UsuarioService } from 'src/app/main/services/usuario.service';
import { GlobalService } from 'src/app/services/global.service';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-list-usuario',
  templateUrl: './list-usuario.component.html',
  styleUrls: ['./list-usuario.component.scss']
})
export class ListUsuarioComponent implements OnInit {

  startPage:number = 0;
  resUsuarios:ResUsuarios;
  loadding:boolean = false;
  listUsuarios:Usuario[] = [];
  changePage  :boolean = false;
  position    :string;
  imAuth:LoginUser | undefined;

  constructor(public _usuario:UsuarioService,
              private _global:GlobalService,
              private _socket:SocketService,
              private confirmationService: ConfirmationService,
              private _auth:AuthService,
              private _msg:MessageService,
              private route:Router){

                this.getAllUsuarios();
                this._global.parseURL(this.route);
                this.imAuth = _auth.userAuth;
              }

  ngOnInit(): void {

    this.OnUsuarios();

  }

  getAllUsuarios(){

    this.loadding = true;

    this._usuario.getAllUsuarios().subscribe({
      next: (value) => {
        this.loadding = false;
        this.resUsuarios = value;
        this.listUsuarios = value.data;
      },
      error: (err) => {
        this.loadding = false;
        console.log(err);
      },
    })

  }

  paginate(event:any) {

    this.changePage = true;

    this.startPage = event.first;
    this._usuario.getAllUsuarios(event.rows, event.first).subscribe({
      next: (value) => {
        this.resUsuarios = value;
        this.listUsuarios = value.data;
      },
      error: (err) => {
        console.log(err);
      },
    });

  }

  OnUsuarios(){

    this._usuario.OnListaCursos().subscribe({
      next: (value) => {
        this.listUsuarios = value.data;
      },
      error: (err) => {
        console.log(err);
      },
    })

  }

  Inhabilitar(usuario:Usuario, tipoEnable:boolean){

    this.position = 'top';
    let msgConfirm = (!tipoEnable)?'habilitación':'inhabilitación';
    let msgoptions = (!tipoEnable)?'si':'no';

    this.confirmationService.confirm({
        message: `¿Está seguro de la ${msgConfirm} al usuario <b>${usuario.Nombres}</b>?<br>
                  una vez confirmado el usuario ${msgoptions} podrá realizar operaciones en el sistema`,
        header: `Confirmación de la ${msgConfirm}`,
        icon: 'pi pi-info-circle',
        accept: () => {

          if(this.imAuth?.Id != usuario.Id){

            this._usuario.enableUsuario(usuario.Id!,!usuario.Habilitado).subscribe({
              next: (value) => {
                if(value.ok){
                  this.toast('success', msgConfirm, value.msg);
                  this._socket.EmitEvent('usuario_eliminado');
                }else{
                  this.toast('warn', value.msg);
                }

              },
              error: (err) => {
                console.log(err);
              },
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


  confirmDelete(usuario:Usuario) {

    this.position = 'top';

    this.confirmationService.confirm({
        message: `¿Está seguro de eliminar al usuario <b>${usuario.Nombres}</b>?`,
        header: 'Confirmación de eliminar',
        icon: 'pi pi-info-circle',
        accept: () => {

          if(this.imAuth?.Id!=usuario.Id){

            this._usuario.deleteUsuario(usuario.Id!).subscribe({
              next: (value) => {

                if(value.ok){
                  this.toast('success','Eliminación',value.msg);
                  this._socket.EmitEvent('usuario_eliminado');
                }else{
                  this.toast('warn', value.msg);
                }

              },
              error: (err) => {
                console.log(err);
              },
            })

          }else{
            this.toast('error','Eliminación','No se puede realizar la autoeliminación');
          }

        },
        reject: (type:any) => {
          console.log("No eliminar");
        },
        key: "deleteDialog"
    });

  }

  sendEdit(id:number){
    this.route.navigate(['/system/usuarios/editar-usuario',id])
  }

  toast(type:string, msg:string, detail:string=''){
    this._msg.add({severity:type, summary:msg, detail});
  }

}
