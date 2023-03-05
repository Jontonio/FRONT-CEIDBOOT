import { Component, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Docente } from 'src/app/main/class/Docente';
import { DocenteService } from 'src/app/main/services/docente.service';
import { SocketService } from 'src/app/services/socket.service';
import { FormDocenteComponent } from 'src/app/main/components/form-docente/form-docente.component';

interface Card {
  name: string,
  code: string
}

@Component({
  selector: 'app-add-docente',
  templateUrl: './add-docente.component.html',
  styleUrls: ['./add-docente.component.scss']
})
export class AddDocenteComponent {

  @ViewChild(FormDocenteComponent) hijo:FormDocenteComponent;
  loadding:boolean = false;

  constructor(private _msg:MessageService,
              private _docente:DocenteService,
              private _socket: SocketService) {}

  save(docente:Docente){

    this.loadding = true;

    this._docente.createDocente(docente).subscribe({

      next: (value) => {

       setTimeout(() => {

        this.loadding = false;

        if(value.ok){
          this._socket.EmitEvent('Nuevo_docente');
          this.toast('success', value.msg);
          this.hijo.formDocente.reset();
        }else{
          this.toast('error', value.msg)
        }

       }, 200);

      },
      error: (err) => {

        this.loadding = false;
        err.error.message.forEach( (err:string) => {
          this.toast('error',err,'Error al registrar los datos')
        })
      }

    });
  }

  toast(type:string, msg:string, detail:string=''){
    this._msg.add({severity:type, summary:msg, detail});
  }

}
