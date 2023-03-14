import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { Curso, ResCurso } from 'src/app/main/curso/class/Curso';
import { CursoService } from 'src/app/main/curso/services/curso.service';
import { GlobalService } from 'src/app/services/global.service';
import { SocketService } from 'src/app/services/socket.service';


@Component({
  selector: 'app-list-curso',
  templateUrl: './list-curso.component.html',
  styleUrls: ['./list-curso.component.scss']
})
export class ListCursoComponent {

  private deleteCurso$  :Subscription;
  startPage   :number = 0;
  position    :string;

  constructor(public _curso:CursoService,
              private route:Router,
              private _confirService:ConfirmationService,
              private _socket:SocketService,
              private _msg:MessageService) {}

  ngOnDestroy(): void {
    this._curso.listCursos$.unsubscribe();
  }

  paginate(event:any) {
    //event.first = Index of the first record
    //event.rows = Number of rows to display in new page
    //event.page = Index of the new page
    //event.pageCount = Total number of pages
    this.startPage = event.first;
    this._curso.getListaCursos(event.rows, event.first);
  }

  sendEditCurso({ Id }:Curso){
    this.route.navigate(['/system/cursos/editar-curso', Id])
  }

  dialogDelete({ NombreCurso, Id}:Curso) {
    this.position = 'top';
    this._confirService.confirm({
        message: `¿Está seguro de eliminar el curso <b>${NombreCurso.toUpperCase()}</b>?`,
        header: 'Confirmación de eliminar',
        icon: 'pi pi-info-circle',
        accept: () => {
          this.deleteCurso$ = this._curso.deleteCurso(Id!).subscribe({
            next: (value) => {
              if(value.ok){
                this.toast('success', 'Eliminación', value.msg);
                this._socket.EmitEvent('updated_list_curso');
              }else{
                this.toast('warn', value.msg);
              }
              this.deleteCurso$.unsubscribe();
            },
            error: (e) => this.messageError(e)
          })
        },
        reject: (type:any) => {},
        key: "deleteCursoDialog"
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

  toast(type:string, msg:string, detail:string=''){
    this._msg.add({severity:type, summary:msg, detail});
  }

}
