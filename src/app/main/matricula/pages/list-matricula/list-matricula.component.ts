import { Component, OnInit } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Grupo } from 'src/app/main/grupo/class/Grupo';
import { GrupoService } from 'src/app/main/grupo/services/grupo.service';
import { SocketService } from 'src/app/services/socket.service';
import { Matricula } from '../../class/Matricula';
import { Servicio } from '../../class/Servicio';
import { MatriculaService } from '../../services/matricula.service';

@Component({
  selector: 'app-list-matricula',
  templateUrl: './list-matricula.component.html',
  styleUrls: ['./list-matricula.component.scss']
})
export class ListMatriculaComponent implements OnInit {

  /** Variables de clase */
  startPage:number = 0;
  position:string;
  moreInfo:boolean = false;
  moreInfoMatricula:boolean = false;
  description:string;
  infoMatricula:Matricula;
  listAddEnGrupo:any[] = [];
  loadingSave:boolean = false;
  visibleAsignarGrupo:boolean = false;

  selecGrupo:Grupo;
  IdSelect:number | undefined;

  constructor(private readonly _msg:MessageService,
              public readonly _matricula:MatriculaService,
              private readonly _socket:SocketService,
              public readonly _grupo:GrupoService,
              public readonly _confirService:ConfirmationService) {}

  ngOnInit(): void {}

  paginate(event:any) {
    this.startPage = event.first;
    this._matricula.getListaMatriculados(event.rows, event.first);
  }

  dialogDelete(matricula:Matricula) {
    this.position = 'top';
    this._confirService.confirm({
        message: `¿Está seguro de eliminar al preinscrito?. Una vez eliminado no habrá registros de la persona</span>`,
        header: 'Confirmación de eliminar al preinscrito',
        icon: 'pi pi-info-circle',
        accept: () => {
          console.log(matricula)
          this.deleteMatriculado(matricula.Id);
        },
        reject: (type:any) => {
          console.log("No eliminar");
        },
        key: "deleteMatriculadoDialog"
    });
  }

  deleteMatriculado(Id:number){
    this._matricula.removeMatriculado(Id).subscribe({
      next: (value) => {
        this._socket.EmitEvent('updated_list_matriculados');
        console.log(value)
      },
      error: (e) => {
        console.log(e)
      }
    })
  }

  moreService(servicio:Servicio){
    this.moreInfo = true;
    this.description = servicio.Descripcion;
  }

  moreInfoEstudiante(matricula:Matricula){
    this.moreInfoMatricula = true;
    this.infoMatricula = matricula;
  }

  selectedGrupo({ value }:MatSelectChange){
    this.IdSelect = value;
  }

  deleteDuplicate(list:any[], data:any){
    const i = list.findIndex( item => item.matricula.Id==data.matricula.Id)
    return list.splice(i, 1);
  }

  deleteUndefined(list:any[]){
    return list.filter(item => item.grupo.Id!==undefined);
  }

  save({Id, estudiante }:Matricula){

    if(this.IdSelect){
      const data:any = { grupo: {'Id':this.IdSelect }, matricula:{'Id':Id}, estudiante:{'Id':estudiante.Id }};
      this.loadingSave = true;
      this._matricula.addAlumnoEnGrupo( data ).subscribe({
        next: (value) => {
          if(value.ok){
            this.toast('success', value.msg)
            this._socket.EmitEvent('updated_list_matriculados');
            this._socket.EmitEvent('updated_list_grupo');
            this.IdSelect = undefined;
          }else{
            this.toast('warn', value.msg)
          }
          this.loadingSave = false;
        },
        error: (e) => {
          this.loadingSave = false;
          console.log(e)
        }
      })
    }
  }


  toast(severity:string, summary:string, detail:string=''){
    this._msg.add({severity, summary, detail});
  }

  messageError(e:any){
    const msg = e.error.message;
    Array.isArray(msg)?msg.forEach( (e:string) => this.toast('error', e, 'Error de validación de datos')):
                                                  this.toast('error', msg,`${e.error.error}:${e.error.statusCode}`)
  }

}
