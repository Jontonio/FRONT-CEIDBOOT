import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
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

  startPage   :number = 0;
  resUsuarios :ResUsuarios;
  loadding    :boolean = false;
  listUsuarios:Usuario[] = [];
  changePage  :boolean = false;
  position    :string;
  imAuth      :LoginUser | undefined;

  constructor(public _usuario:UsuarioService,
              private _global:GlobalService,
              private _socket:SocketService,
              private confirmationService: ConfirmationService,
              private _auth:AuthService,
              private _msg:MessageService,
              private route:Router){

                this.getAllUsuarios();
                this._global.parseURL(this.route);
                this.imAuth = this._auth.userAuth;

              }

  ngOnInit(): void {

    this.OnUsuarios();

  }

  /* A method that is responsible for obtaining all the users of the system. */
  getAllUsuarios(){

    this.loadding = true;
    this._usuario.getAllUsuarios().subscribe({
      next: (value) => {
        setTimeout(() => {
          this.loadding = false;
          this.resUsuarios = value;
          this.listUsuarios = value.data;
        }, 200);
      },
      error: (err) => {
        this.loadding = false;
        console.log(err);
      }
    })

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

    this.changePage = true;
    this.startPage = event.first;
    this._usuario.getAllUsuarios(event.rows, event.first).subscribe({
      next: (value) => {
        this.resUsuarios = value;
        this.listUsuarios = value.data;
      },
      error: (err) => {
        console.log(err);
      }
    });

  }

  /* A function that is called when the user clicks on the button "Usuarios" */
  OnUsuarios(){

    this._usuario.OnListaCursos().subscribe({
      next: (value) => {
        this.listUsuarios = value.data;
      },
      error: (err) => {
        console.log(err);
      }
    })

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
              }
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

  /* A function that receives an id and redirects the user to the edit-user page. */
  sendEditUserio(id:number){
    this.route.navigate(['/system/usuarios/editar-usuario',id])
  }

  //TODO: need implement search method and generate reports

  /* A function that receives three parameters, the first is the type of message, the second is the
  message and the third is the detail of the message. The function toast() calls the function add()
  of the class MessageService. The function add() is responsible for displaying the message to the
  user. */
  toast(type:string, msg:string, detail:string=''){
    this._msg.add({severity:type, summary:msg, detail});
  }

}
