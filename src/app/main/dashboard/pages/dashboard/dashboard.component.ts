import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { EstadoGrupo } from 'src/app/main/grupo/class/EstadoGrupo';
import { GrupoService } from 'src/app/main/grupo/services/grupo.service';
import { DataHorizontalBar, DataVerticalBar } from 'src/app/class/Graphics';
import { Grupo, ResGrupo } from 'src/app/main/grupo/class/Grupo';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Modulo } from 'src/app/main/curso/class/Modulo';
import { CategoriaPago } from 'src/app/main/grupo/class/CategoriaPago';
import { Data, ReporteGeneral, ReporteOtrosPagos, ReportePagos } from '../../class/ReportePagos';

/** librerias externas */
import * as moment from 'moment';
moment.locale("es");

/** Librerias para generar archivos excel */
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { MessageService } from 'primeng/api';
import { HttpErrorResponse } from '@angular/common/http';
import { tap } from 'rxjs';


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
  listModulos:Modulo[] = [];
  listCategoriaPago:CategoriaPago[] = [];
  resGrupo:ResGrupo;
  loadingGruposLista:boolean = false;
  dateReporteGeneral:Date;
  listReportePagos:ReportePagos[] = [];
  listReporteGeneral:ReporteGeneral[] = [];
  listReporteOtrosPagos:ReporteOtrosPagos[] = [];

  /** Lista indice de pagos */
  indice:Data[] = [];
  total:Data[] = [];

  /** otra variables */
  grupo:Grupo;
  formInputs:FormGroup;
  startPage:number = 0;
  limit:number = 5;
  offset:number = 0;
  selectGrupoIndice:Grupo;

  constructor(private readonly _dashboard:DashboardService,
              private readonly _grupo:GrupoService,
              private readonly fb:FormBuilder,
              private readonly _msg:MessageService) {
    this.createFormImputs();
    this.getEstadosGrupo();
    this.getDataHorizontalBar(1);
    this.getLimitGrupos(2);
    this.getListaModulos();
    this.getListaCategoriasPago();
    this.dateReporteGeneral = moment().toDate();
  }

  ngOnInit(): void {}

  createFormImputs(){
    this.formInputs = this.fb.group({
      inputEstadoGrupo:[null, [Validators.required]],
      inputGrupo:[null,[Validators.required]],
      inputModulo:[null],
      inputCategoriaPago:[null]
    })
  }

  get inputEstadoGrupo(){
    return this.formInputs.controls['inputEstadoGrupo']
  }
  get inputGrupo(){
    return this.formInputs.controls['inputGrupo']
  }
  get inputModulo(){
    return this.formInputs.controls['inputModulo']
  }
  get inputCategoriaPago(){
    return this.formInputs.controls['inputCategoriaPago']
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

  getListaModulos(){
    this._dashboard.getListaModulos().subscribe({
      next:(value) => {
        if(value.ok){
          this.listModulos = value.data as Array<Modulo>;
          return;
        }
      },
      error:(e) => {
        console.log(e)
      }
    })
  }

  getListaCategoriasPago(){
    this._dashboard.getCategoriasPago().subscribe({
      next:(value) => {
        if(value.ok){
          this.listCategoriaPago = value.data as Array<CategoriaPago>;
          return;
        }
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
    this._dashboard.
    getDataVerticalBarPagosMora(grupoId, estadoGrupoId).
    pipe(
      tap( data => {
        // data.forEach(objeto => {
        //   objeto.series.forEach(item => {
        //     item.value = Number(item.value);
        //   });
        // });
        return data;
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

  generarReporteEstudiantes(){
    if(this.formInputs.invalid){
      Object.keys( this.formInputs.controls ).forEach( label => this.formInputs.controls[ label].markAsDirty() )
      return;
    }
    this._dashboard.
        getListaEstudiantesConPagoGrupoModulo(this.inputGrupo.value.Id,
                                              this.inputCategoriaPago.value.Id,
                                              this.inputModulo.value.Id)
        .subscribe({
          next:(value) => {
            if(value.length==0) this.toast('warn','Reporte estudiantes','No se encontraron datos registrados para esas opciones de estado y grupo')
            this.listReportePagos = value;
            this.listReportePagos.map(data => data.FechaPago = moment(new Date(data.FechaPago)).format('DD [de] MMMM [del] YYYY'));
          },
          error:(e) => {
            console.log(e)
          }
        })
  }

  genearReportePagosExcel(){
    if(this.listReportePagos.length == 0){
      this.toast('warn','Reporte','Genere datos antes de descargar el reporte del grupo.')
      return;
    }
    const data = this.transformReportePagoToExls(this.listReportePagos);
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet(data);
    // Configurar la anchura del encabezado
    const headerWidth = [{ wch: 5 },
                         { wch: 15 },
                         { wch: 15 },
                         { wch: 15 },
                         { wch: 15 },
                         { wch: 15 },
                         { wch: 15 },
                         { wch: 20 },
                         { wch: 15 },
                         { wch: 5 }]; // Ejemplo de anchuras para las 10 columnas
    worksheet['!cols'] = headerWidth;

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Hoja 1');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, `Grupo-${this.inputGrupo.value.Id}-${this.inputCategoriaPago.value.TipoCategoriaPago}.xlsx`);
  }

  transformReportePagoToExls(data:ReportePagos[]){
    const header = ['Código del grupo',
                    'Nombres',
                    'Apellido paterno',
                    'Apellido materno',
                    'Categoria de pago',
                    'Medio del pago',
                    'Monto pago S/.',
                    'Fecha de pago',
                    'Código del voucher',
                    'Módulo'];
    const newData:any[] = [];
    newData.push(header);
    data.forEach( item => newData.push(Object.values(item)))
    return newData;
  }

  paginate(event:any) {
    this.startPage = event.first;
    this.limit = event.rows;
    this.offset = event.firts;
    this.getLimitGrupos(2, this.limit, this.offset);
  }

  reporteGeneral(){
    const data = moment(this.dateReporteGeneral,'YYYY-MM-DD');
    const anio = data.format('YYYY');
    const numMes = data.format('MM');
    this._dashboard.getResumenGeneralPagos(anio, numMes).subscribe({
      next: (value) => {
        if(value.length==0) this.toast('warn','Reporte general','No se encontraron datos registrados para esa fecha')
        this.listReporteGeneral = value;
      },
      error: (e) => {
        console.log(e)
      }
    })
  }

  generarReporteGeneralExcel(){
    if(this.listReporteGeneral.length == 0){
      this.toast('warn','Reporte','Genere datos antes de descargar el reporte general.')
      return;
    }
    const data = this.transformGeneralPagoToExls(this.listReporteGeneral);
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet(data);
    // Configurar la anchura del encabezado
    const headerWidth = [{ wch: 5 },
                         { wch: 15 },
                         { wch: 15 },
                         { wch: 15 },
                         { wch: 5 },
                         { wch: 15 }]; // Ejemplo de anchuras para las 10 columnas
    worksheet['!cols'] = headerWidth;

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Hoja 1');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, `Reporte-general-${this.dateReporteGeneral}.xlsx`);
  }

  generarReporteOtrosPagosdasExcel(){
    if(this.listReporteGeneral.length == 0){
      this.toast('warn','Reporte','Genere datos antes de descargar el reporte general.')
      return;
    }
    const data = this.transformGeneralPagoToExls(this.listReporteGeneral);
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet(data);
    // Configurar la anchura del encabezado
    const headerWidth = [{ wch: 5 },
                         { wch: 15 },
                         { wch: 15 },
                         { wch: 15 },
                         { wch: 5 },
                         { wch: 15 }]; // Ejemplo de anchuras para las 10 columnas
    worksheet['!cols'] = headerWidth;

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Hoja 1');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, `Reporte-general-${this.dateReporteGeneral}.xlsx`);
  }

  transformGeneralPagoToExls(data:ReporteGeneral[]){
    const header = ['Código del grupo',
                    'Nombre del curso',
                    'Nivel',
                    'Pago total S/.',
                    'Mes',
                    'Categoria pago'];
    const newData:any[] = [];
    newData.push(header);
    data.forEach( item => newData.push(Object.values(item)))
    return newData;
  }

  reporteOtrosPagos(){
    const data = moment(this.dateReporteGeneral,'YYYY-MM-DD');
    const anio = data.format('YYYY');
    const numMes = data.format('MM');
    this._dashboard.getReproteOtrosPagos(anio, numMes).subscribe({
      next: (value) => {
        if(value.length==0) this.toast('warn','Reporte Otros pagos','No se encontraron datos registrados para esa fecha')
        this.listReporteOtrosPagos = value;
      },
      error: (e) => {
        console.log(e)
      }
    })
  }

  getIndiceData(grupo:Grupo){
    this.selectGrupoIndice = grupo;
    this._dashboard.getIndiceDeDeudaVencida(grupo.Id).subscribe({
      next: (value) => {
        this.indice = value.indice;
        this.total = value.total;
      },
      error: (e) => {
        console.log(e)
      }
    })
  }

   /**
   * The function handles error messages from HTTP responses and displays them as toasts.
   * @param {HttpErrorResponse} e - The parameter "e" is an object of type HttpErrorResponse, which is an
   * Angular class that represents an HTTP response that includes an error status code.
   */
   messageError(e:HttpErrorResponse){
    if(Array.isArray(e.error.message)){
      e.error.message.forEach( (e:string) => {
        this.toast('error',e,'Error de validación de datos')
      })
    }else{
      this.toast('error',e.error.message,`${e.error.error}:${e.error.statusCode}`)
    }
  }

 /**
  * The function adds a message with a specified type, summary, and optional detail to a message list.
  * @param {string} type - The type of the message, which can be one of the following values:
  * "success", "info", "warn", or "error". This determines the color and icon of the message displayed
  * to the user.
  * @param {string} msg - The `msg` parameter is a string that represents the main message or summary
  * of the toast notification. It is used to provide a brief and informative message to the user.
  * @param {string} [detail] - The `detail` parameter is an optional string parameter that provides
  * additional information or context related to the message being displayed. If provided, it will be
  * displayed along with the `summary` message.
  */
  toast(type:string, msg:string, detail?:string){
    this._msg.add({severity:type, summary:msg, detail});
  }


}
