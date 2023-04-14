import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Grupo } from 'src/app/main/grupo/class/Grupo';
import { GrupoService } from 'src/app/main/grupo/services/grupo.service';
import { Subscription } from 'rxjs';
import { UnAuthorizedService } from 'src/app/services/unauthorized.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-ver-grupo',
  templateUrl: './ver-grupo.component.html',
  styleUrls: ['./ver-grupo.component.scss']
})
export class VerGrupoComponent implements OnInit {

  /** Subscription variables */
  grupo$:Subscription;

  /** Variables de clase */
  grupo:Grupo;
  urlLista:string;
  loaddingImage:boolean = true;

  constructor(private routerActive:ActivatedRoute,
              private _grupo:GrupoService,
              private readonly _unAuth:UnAuthorizedService,
              private route:Router,
              private _msg:MessageService) {
    this.getIdParams(this.routerActive);
  }

  ngOnInit(): void {
    this.urlLista = '/system/grupos/lista-grupos';
  }

  ngOnDestroy(): void {
    if(this.grupo$) this.grupo$.unsubscribe();
  }

  getIdParams(routerActive:ActivatedRoute){
    const { id } = routerActive.snapshot.params;
    this.grupo$ = this._grupo.getOneGrupo(id).subscribe({
      next: (value) => {
        if(!value.ok) return;
        this.grupo = value.data as Grupo;
      },
      error: (e) =>{
        this.messageError(e);
        this._unAuth.unAuthResponse(e);
        this.route.navigate([this.urlLista]);
      }
    })
  }

  messageError(e:HttpErrorResponse){
    if(e.status==401) return;
    const msg = e.error.message;
    Array.isArray(msg)?msg.forEach((e) => this.toast('error',e,'Error de validación de datos')):
                                                  this.toast('error',msg,`${e.error.error}:${e.error.statusCode}`)
  }

  toast(type:string, msg:string, detail:string=''){
    this._msg.add({severity:type, summary:msg, detail});
  }

}
