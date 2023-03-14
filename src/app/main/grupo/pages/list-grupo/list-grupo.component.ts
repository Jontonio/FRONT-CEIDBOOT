import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { GrupoService } from 'src/app/main/grupo/services/grupo.service';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-list-grupo',
  templateUrl: './list-grupo.component.html',
  styleUrls: ['./list-grupo.component.scss']
})
export class ListGrupoComponent {

  startPage:number = 0;

  constructor(private _msg:MessageService,
              public _grupo:GrupoService) {}

  ngOnDestroy(): void {
    this._grupo.listGrupos$.unsubscribe();
  }

  paginate(event:any) {
    this.startPage = event.first;
    this._grupo.getListaGrupos(event.rows, event.first);
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
