import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { GrupoService } from 'src/app/main/grupo/services/grupo.service';

@Component({
  selector: 'app-list-grupo',
  templateUrl: './list-grupo.component.html',
  styleUrls: ['./list-grupo.component.scss']
})
export class ListGrupoComponent {

  /** Variables de clase */
  startPage:number = 0;

  constructor(private readonly _msg:MessageService, public readonly _grupo:GrupoService) {}

  ngOnDestroy(): void {
    if(this._grupo.listGrupos$) this._grupo.listGrupos$.unsubscribe();
  }

  paginate(event:any) {
    this.startPage = event.first;
    this._grupo.getListaGrupos(event.rows, event.first);
  }

  messageError(e:any){
    const msg = e.error.message;
    Array.isArray(msg)?msg.forEach((e) => this.toast('error',e,'Error de validación de datos')):
                                          this.toast('error',msg,`${e.error.error}:${e.error.statusCode}`)
  }

  toast(type:string, msg:string, detail:string=''){
    this._msg.add({severity:type, summary:msg, detail});
  }

}
