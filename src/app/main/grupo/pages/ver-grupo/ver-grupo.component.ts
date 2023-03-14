import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Grupo } from 'src/app/main/grupo/class/Grupo';
import { GrupoService } from 'src/app/main/grupo/services/grupo.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-ver-grupo',
  templateUrl: './ver-grupo.component.html',
  styleUrls: ['./ver-grupo.component.scss']
})
export class VerGrupoComponent implements OnInit {

  grupo$:Subscription;

  grupo:Grupo;
  urlLista:string = '/system/grupos/lista-grupos';
  loaddingImage:boolean = true;
  image_url:string = 'https://firebasestorage.googleapis.com/v0/b/miportafolio-bed62.appspot.com/o/img%2Fsuperior.png?alt=media&token=fd20d032-d797-4804-ab68-ce84654d3e79'

  constructor(private routerActive:ActivatedRoute,
              private _grupo:GrupoService,
              private route:Router,
              private _msg:MessageService) {
    this.getIdParams(this.routerActive);
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.grupo$.unsubscribe();
  }

  getIdParams(routerActive:ActivatedRoute){
    const { id } = routerActive.snapshot.params;
    this.grupo$ = this._grupo.getOneGrupo(id).subscribe({
      next: (value) => {
        console.log(value);
        if(value.ok){
          this.grupo = value.data as Grupo;
        }
      },
      error: (e) =>{
        this.messageError(e);
        this.route.navigate([this.urlLista]);
      }
    })
  }

  onImageLoad(){
    this.loaddingImage = false;
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
