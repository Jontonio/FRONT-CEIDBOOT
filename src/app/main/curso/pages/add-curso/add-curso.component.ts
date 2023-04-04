import { Component, OnInit, ViewChild } from '@angular/core';
import { CursoService } from 'src/app/main/curso/services/curso.service';
import { MessageService } from 'primeng/api';
import { SocketService } from 'src/app/services/socket.service';
import { Curso } from 'src/app/main/curso/class/Curso';
import { FormCursoComponent } from 'src/app/main/curso/components/form-curso/form-curso.component';
import { Router } from '@angular/router';
import { optionOperation } from 'src/app/main/class/global';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-add-curso',
  templateUrl: './add-curso.component.html',
  styleUrls: ['./add-curso.component.scss']
})
export class AddCursoComponent {

  /** ViewChild variables */
  @ViewChild(FormCursoComponent) hijo: FormCursoComponent;

  /** Subscription variables */
  private updateCurso$:Subscription;
  private createCurso$:Subscription;

  /** variables de clase */
  loading:boolean
  urlLista:string;

  constructor(private _msg:MessageService,
              private route:Router,
              private _curso:CursoService,
              private _socket:SocketService) {

                this.urlLista = '/system/cursos/lista-cursos';
                this.loading  = false;
  }

  ngOnDestroy(): void {
    if(this.createCurso$) this.createCurso$.unsubscribe();
    if(this.updateCurso$) this.updateCurso$.unsubscribe();
  }

  createCurso(opt:optionOperation){
    this.createCurso$ = this._curso.createCurso(opt.data as Curso).subscribe({
      next: (resCurso) => {
        setTimeout(() => {
          this.loading = false;
          if(!resCurso.ok){
            this.toast('warn', resCurso.msg);
            return;
          }
          this._socket.EmitEvent('updated_list_curso');
          this.toast('success',resCurso.msg,'');
          this.hijo.resetForm();
        }, 200);
      },
      error: (e) => {
        this.loading = false;
        this.messageError(e);
      }
    })
  }

  updateCurso(opt:optionOperation){
    this.updateCurso$ = this._curso.updateCurso(opt.Id!, opt.data as Curso).subscribe({
      next: (resCurso) => {
        this.loading = false;
        if(!resCurso.ok){
          this.toast('warn',resCurso.msg,'');
          return;
        }
        this._socket.EmitEvent('updated_list_curso');
        this.toast('success',resCurso.msg);
        this.route.navigate([this.urlLista])
      },
      error: (e) => {
        this.loading = false;
        this.messageError(e);
      }
    })
  }

  saveData(opt:optionOperation){
    this.loading = true;
    opt.option?this.updateCurso(opt):this.createCurso(opt)
  }


  toast(type:string, msg:string, detail:string=''){
    this._msg.add({severity:type, summary:msg, detail});
  }

  messageError(e:any){
    const msg = e.error.message;
    Array.isArray(msg)?msg.forEach( (e:string) => this.toast('error', e, 'Error de validación de datos')):
                                                  this.toast('error', msg,`${e.error.error}:${e.error.statusCode}`)
  }

}
