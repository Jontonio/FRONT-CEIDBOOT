import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { EstadoGrupo } from 'src/app/main/grupo/class/EstadoGrupo';
import { GrupoService } from 'src/app/main/grupo/services/grupo.service';
import { DataHorizontalBar, DataVerticalBar } from 'src/app/class/Graphics';
import { Grupo, ResGrupo } from 'src/app/main/grupo/class/Grupo';
import { FormBuilder, FormGroup } from '@angular/forms';
import { map } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  listEstadoGrupo:EstadoGrupo[] = [];
  estadoGrupo:EstadoGrupo;
  dataEstudiantesGrupo:DataHorizontalBar[] = [];
  dataPagosMora:DataVerticalBar[] = [];
  listGrupos:Grupo[] = [];
  listGruposLimit:Grupo[] = [];
  resGrupo:ResGrupo;
  loadingGruposLista:boolean = false;

  grupo:Grupo;
  formInputs:FormGroup;
  startPage:number = 0;
  limit:number = 5;
  offset:number = 0;

  constructor(private readonly _dashboard:DashboardService,
              private readonly _grupo:GrupoService,
              private readonly fb:FormBuilder) {
    this.createFormImputs();
    this.getEstadosGrupo();
    this.getDataHorizontalBar(1);
    this.getLimitGrupos(2);
  }

  ngOnInit(): void {}

  createFormImputs(){
    this.formInputs = this.fb.group({
      inputEstadoGrupo:[null],
      inputGrupo:[null]
    })
  }

  getDataHorizontalBar(idEstado:number){
    this._dashboard.getDataHorizontalBarEstudinatesEnGrupo(idEstado).subscribe({
      next:(res) => {
        this.dataEstudiantesGrupo = res;
      },
      error:(e) => {
        console.log(e)
      }
    })
  }

  getEstadosGrupo(){
    this._grupo.getAllEstadoGrupo().subscribe({
      next: (value) => {
        if(value.ok){
          this.listEstadoGrupo = value.data as Array<EstadoGrupo>;
          return;
        }
      },
      error: (e) => {
        console.log(e)
      }
    })
  }

  selectedEstado({ value }:any){
    this.estadoGrupo = value;
    this.getDataHorizontalBar(this.estadoGrupo.Id);
  }

  getDataVerticalBarPagosMora(grupoId:number, estadoGrupoId:number){
    this._dashboard.getDataVerticalBarPagosMora(grupoId, estadoGrupoId).
    pipe(
      map( res => {
        // res.series.forEach( res => { res.data = res.data.map(num => Number(num)) })
        return res;
      })
    )
    .subscribe({
      next:(value) => {
        this.dataPagosMora = value;
      },
      error:(e) => {
        console.log(e)
      }
    })
  }

  selectedGrupo(grupo:Grupo){
    this.grupo = grupo;
    this.getDataVerticalBarPagosMora(this.grupo.Id, this.estadoGrupo.Id );
  }

  selectedEstadoGrupo(estadoGrupo:EstadoGrupo){
    this.estadoGrupo = estadoGrupo;
    this.getGrupos(this.estadoGrupo.Id);
  }

  getGrupos(idEstadoGrupo:number = 1){
    this._grupo.getGruposReporte(idEstadoGrupo).subscribe({
      next: (value) => {
        if(value.ok){
          this.listGrupos = value.data as Array<Grupo>;
          return;
        }
      },
      error: (e) => {
        console.log(e)
      }
    })
  }

  getLimitGrupos(idEstadoGrupo:number, limit:number = 5, offset:number = 0){
    this.loadingGruposLista = true;
    this._grupo.getGruposReporte(idEstadoGrupo, true, this.limit, this.offset ).subscribe({
      next: (value) => {
        this.loadingGruposLista = false;
        if(value.ok){
          console.log(value)
          this.resGrupo = value;
          this.listGruposLimit = value.data as Array<Grupo>;
          return;
        }
      },
      error: (e) => {
        console.log(e)
      }
    })
  }

  paginate(event:any) {
    this.startPage = event.first;
    this.limit = event.rows;
    this.offset = event.firts;
    this.getLimitGrupos(2, this.limit, this.offset);
  }

}
