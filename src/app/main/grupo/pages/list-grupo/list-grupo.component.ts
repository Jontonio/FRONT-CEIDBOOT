import { Component } from '@angular/core';
import { GrupoService } from 'src/app/main/grupo/services/grupo.service';
import { EstadoGrupo } from '../../class/EstadoGrupo';
import { Grupo } from '../../class/Grupo';
import { ConfirmationService, MessageService } from 'primeng/api';
import { SocketService } from 'src/app/services/socket.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-list-grupo',
  templateUrl: './list-grupo.component.html',
  styleUrls: ['./list-grupo.component.scss']
})
export class ListGrupoComponent {

  /** Variables de clase */
  startPage:number
  selectEstadoGrupo:string;
  selectCodeEstado:string;
  listEstadosGrupo:EstadoGrupo[];
  terminoBusqueda:string;
  limit:number  = 5;
  offset:number = 0;

  constructor(public readonly _grupo:GrupoService,
              private readonly confirService:ConfirmationService,
              private _msg: MessageService,
              private readonly _socket:SocketService) {
    this.getListaEstadosGrupo();
    this.inicializeVariables();
  }

  ngOnDestroy(): void {
    if(this._grupo.listGrupos$) this._grupo.listGrupos$.unsubscribe();
  }

  inicializeVariables(){
    this.startPage = 0;
    this.selectEstadoGrupo = 'Mostrar todo';
    this.selectCodeEstado = 'all';
    this.listEstadosGrupo= [];
  }

  getListaEstadosGrupo(){
    this._grupo.getAllEstadoGrupo()
    .subscribe({
      next: (value) => {
        const newArr = [...value.data as EstadoGrupo[], {EstadoGrupo: 'Mostrar todo', CodeEstado: 'all'}];
        this.listEstadosGrupo = newArr as Array<EstadoGrupo>;
      }
    })
  }

  selectForFiltro({ EstadoGrupo, CodeEstado}:EstadoGrupo){
    this.selectEstadoGrupo = EstadoGrupo;
    this.selectCodeEstado = CodeEstado;
  }

  buscarTermino(termino:string){
    this.terminoBusqueda = termino;
  }

  paginate(event:any) {
    this.startPage = event.first;
    this.limit = event.rows;
    this.offset = event.first;
    this._grupo.getListaGrupos(this.limit, this.offset);
  }

  confirmarEliminarGrupo(grupo:Grupo){
    const { curso, tipoGrupo} = grupo;
    this.confirService.confirm({
      message: `<b>¿Está seguro de eliminar al grupo ${tipoGrupo.NombreGrupo} con el curso ${curso.NombreCurso} ${curso.nivel.Nivel} G-${grupo.Id}</b>?<br>
                Una vez confirmado no habrá registros del grupo`,
      header: `Confirmación de para eliminación del grupo`,
      icon: 'pi pi-info-circle',
      accept: () => {
        this._grupo.deleteGrupo(grupo.Id).subscribe({
          next: (res) => {
            if(res.ok){
              this._socket.EmitEvent('updated_list_grupo',{ limit: this.limit, offset: this.offset})
              this.toast('success', res.msg);
              console.log(res)
            }
          },
          error: (e) => {
            this.messageError(e);
            console.log(e)
          }
        })
      },
      reject: (type:any) => {
        console.log("No eliminar");
      },
      key: "deleteGrupoDialog"
    });
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
