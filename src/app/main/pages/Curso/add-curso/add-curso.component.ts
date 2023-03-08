import { Component, OnInit, ViewChild } from '@angular/core';
import { CursoService } from 'src/app/main/services/curso.service';
import { MessageService } from 'primeng/api';
import { SocketService } from 'src/app/services/socket.service';
import { Curso } from 'src/app/main/class/Curso';
import { FormCursoComponent } from 'src/app/main/components/form-curso/form-curso.component';
import { GlobalService } from 'src/app/services/global.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-add-curso',
  templateUrl: './add-curso.component.html',
  styleUrls: ['./add-curso.component.scss']
})
export class AddCursoComponent implements OnInit {

  @ViewChild(FormCursoComponent) hijo: FormCursoComponent;
  loadding:boolean = false;

  constructor(private _msg:MessageService,
              private _global:GlobalService,
              private route:Router,
              private _curso:CursoService,
              private _socket:SocketService) {

                this._global.parseURL(this.route);

            }

  ngOnInit(): void {}

  save(curso:Curso){

    this.loadding = true;

    this._curso.createCurso(curso).subscribe({
      next: (resCurso) => {

        setTimeout(() => {

          this.loadding = false;

          if(resCurso.ok){

            this.toast('success',resCurso.msg,'');
            this.hijo.formCurso.reset();
            this._socket.EmitEvent('Nuevo_curso');

          }else{

            this.toast('warn',resCurso.msg,'');

          }

        }, 200);

      },
      error: (err) => {

        this.loadding = false;

        err.error.message.forEach( (msg:string) => {
          this.toast('warn',msg,'Error al registrar un nuevo curso');
        });

      },
    })

  }

  toast(type:string, msg:string, detail:string=''){
    this._msg.add({severity:type, summary:msg, detail});
  }

}
