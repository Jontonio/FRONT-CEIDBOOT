import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { Curso } from 'src/app/main/curso/class/Curso';
import { CursoService } from 'src/app/main/curso/services/curso.service';
import { SocketService } from 'src/app/services/socket.service';


@Component({
  selector: 'app-list-curso',
  templateUrl: './list-curso.component.html',
  styleUrls: ['./list-curso.component.scss']
})
export class ListCursoComponent {

  /** Subscription variables */
  deleteCurso$  :Subscription;

  /** Variables de clase */
  startPage   :number = 0;
  position    :string;

  constructor(public  readonly _curso:CursoService,
              private readonly route:Router,
              private readonly _confService:ConfirmationService,
              private readonly _socket:SocketService,
              private readonly _msg:MessageService) {}

  ngOnDestroy(): void {
    if(this._curso.listCursos$) this._curso.listCursos$.unsubscribe();
    if(this.deleteCurso$) this.deleteCurso$.unsubscribe();
  }

  paginate(event:any) {
    //event.first = Index of the first record
    //event.rows = Number of rows to display in new page
    //event.page = Index of the new page
    //event.pageCount = Total number of pages
    this.startPage = event.first;
    this._curso.getListaCursos(event.rows, event.first);
  }

  dialogDelete({ NombreCurso, Id}:Curso) {
    this.position = 'top';
    this._confService.confirm({
        message: `¿Está seguro de eliminar el curso <b>${NombreCurso.toUpperCase()}</b>?`,
        header: 'Confirmación de eliminar',
        icon: 'pi pi-info-circle',
        accept: () => {
          this.deleteCurso(Id!);
        },
        reject: (type:any) => {},
        key: "deleteCursoDialog"
    });
  }

  cursoApertura(curso:Curso) {
    this.position = 'top';
    let msgConfirm = (!curso.EstadoApertura)?'aperturar el curso':'cerrar el curso';
    let msgoptions = (!curso.EstadoApertura)?'serán':'no serán';

    this._confService.confirm({
        message: `¿Está seguro de ${msgConfirm} de <b>${curso.NombreCurso}</b>?<br>
                  una vez confirmado los cursos ${msgoptions} públicos`,
        header: `Confirmación de la ${msgConfirm}`,
        icon: 'pi pi-info-circle',
        accept: () => {
          const newCurso = curso;
          newCurso.EstadoApertura = !curso.EstadoApertura;
          this.updateCurso(newCurso, newCurso.Id!);
        },
        reject: (type:any) => {
          console.log("No eliminar");
        },
        key: "cursoAperturaDialog"
    });
  }

  updateCurso(curso:Curso, Id:number){
    this._curso.updateCurso(Id, curso).subscribe({
      next: (value) => {
        if(!value.ok){ return; }
        this.toast('success', value.msg);
        this._socket.EmitEvent('updated_list_curso');
      },
      error: (e) => {
        console.log(e)
      },
    })
  }

  deleteCurso(Id:number){
    this.deleteCurso$ = this._curso.deleteCurso(Id!).subscribe({
      next: (value) => {
        if(!value.ok){
          this.toast('warn', value.msg);
          return;
        }
        this.toast('success', 'Eliminación', value.msg);
        this._socket.EmitEvent('updated_list_curso');
      },
      error: (e) => this.messageError(e)
    })
  }

  toast(severity:string, summary:string, detail:string=''){
    this._msg.add({severity, summary, detail});
  }

  messageError(e:any){
    const msg = e.error.message;
    Array.isArray(msg)?msg.forEach(e => this.toast('error',e,'Error de validación de datos')):
                                        this.toast('error',msg,`${e.error.error}:${e.error.statusCode}`)
  }



}
