import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GrupoService } from '../../services/grupo.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { EstudianteEnGrupo } from '../../class/EstudianteGrupo';
import { Estudiante } from 'src/app/main/matricula/class/Estudiante';
import { Apoderado } from 'src/app/main/matricula/class/Apoderado';
import { DenominServicio } from 'src/app/denomin-servicio/class/Denomin-servicio';
import { Servicio } from 'src/app/main/matricula/class/Servicio';
import { Curso } from 'src/app/main/curso/class/Curso';
import { Pago } from '../../class/Pago';
import { GrupoModulo } from '../../class/GrupoModulo';
import { DataHorizontalBar } from 'src/app/class/Graphics';

@Component({
  selector: 'app-info-estudiante',
  templateUrl: './info-estudiante.component.html',
  styleUrls: ['./info-estudiante.component.scss']
})
export class InfoEstudianteComponent {


  // view: any[] = [700, 300];

  // options
  legend: boolean = true;
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Fechas de pago por módulo';
  yAxisLabel: string = 'Módulos';
  timeline: boolean = true;

  colorScheme = {
    domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
  };

  idEstudiante:string;
  idGrupo: string;
  estudianteEnGrupo:EstudianteEnGrupo;
  estudiante:Estudiante;
  apoderado:Apoderado;
  denominServicio:Servicio;
  data = new Array<DataHorizontalBar>();

  constructor(private activeRouter:ActivatedRoute,
              private _grupo:GrupoService,
              private _msg:MessageService) {
    this.data = [];
    this.getIds(this.activeRouter);
  }

  onSelect(data:any): void {
    // console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data:any): void {
    // console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data:any): void {
    // console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }

  getIds(activeRoute:ActivatedRoute){
    const { idEstudiante, idGrupo } = activeRoute.snapshot.params;
    this.idEstudiante = idEstudiante;
    this.idGrupo = idGrupo;
    this.getDataEstudiante(idEstudiante, idGrupo)
  }

  getDataEstudiante(idEstudiante:string, igGrupo:string){
    this._grupo.getEstudiantesEnGrupoEspecificoById(igGrupo, idEstudiante).subscribe({
      next:(value) => {
        if(value.ok){
          console.log(value)
          this.data = value.others;
          this.estudianteEnGrupo = value.data as EstudianteEnGrupo;
          if(this.estudianteEnGrupo){
            this.estudiante = this.estudianteEnGrupo.estudiante;
            this.apoderado = this.estudiante.apoderado;
            this.denominServicio = this.estudianteEnGrupo.matricula.denomiServicio;
          }
          return;
        }
      },
      error:(e) => {
        this.messageError(e);
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
