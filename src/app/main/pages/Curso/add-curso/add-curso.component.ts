import { Component, OnInit, ViewChild } from '@angular/core';
import { CursoService } from 'src/app/main/services/curso.service';
import { MessageService } from 'primeng/api';
import { SocketService } from 'src/app/services/socket.service';
import { Curso } from 'src/app/main/class/Curso';
import { FormCursoComponent } from 'src/app/main/components/form-curso/form-curso.component';
import { GlobalService } from 'src/app/services/global.service';
import { Router } from '@angular/router';
import { optionOperation } from 'src/app/main/class/global';
import { Subscriber, Subscription } from 'rxjs';


@Component({
  selector: 'app-add-curso',
  templateUrl: './add-curso.component.html',
  styleUrls: ['./add-curso.component.scss']
})
export class AddCursoComponent implements OnInit {

  @ViewChild(FormCursoComponent) hijo: FormCursoComponent;

  private updateCurso$:Subscription;
  private createCurso$:Subscription;

  loadding:boolean = false;
  urlLista:string = '/system/cursos/lista-cursos';

  constructor(private _msg:MessageService,
              private _global:GlobalService,
              private route:Router,
              private _curso:CursoService,
              private _socket:SocketService) {

                this._global.parseURL(this.route);

            }

  ngOnInit(): void {}

  save(opt:optionOperation){
    this.loadding = true;
    if(opt.option){
      this.updateCurso$ = this._curso.updateCurso(opt.Id!, opt.data as Curso).subscribe({
        next: (resCurso) => {
          this.loadding = false;
          if(resCurso.ok){
            this._socket.EmitEvent('updated_list_curso');
            this.toast('success',resCurso.msg);
            this.route.navigate([this.urlLista])
          }else{
            this.toast('warn',resCurso.msg,'');
          }
          this.updateCurso$.unsubscribe();
        },
        error: (e) => {
          this.loadding = false;
          this.messageError(e);
        }
      })
    }else{
      this.createCurso$ = this._curso.createCurso(opt.data as Curso).subscribe({
        next: (resCurso) => {
          setTimeout(() => {
            this.loadding = false;
            if(resCurso.ok){
              this._socket.EmitEvent('updated_list_curso');
              this.toast('success',resCurso.msg,'');
              this.hijo.resetForm();
            }else{
              this.toast('warn',resCurso.msg,'');
            }
            this.createCurso$.unsubscribe();
          }, 200);
        },
        error: (e) => {
          this.loadding = false;
          this.messageError(e);
        }
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
