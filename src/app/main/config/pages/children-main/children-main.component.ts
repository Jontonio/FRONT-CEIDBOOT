import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfigService } from '../../services/config.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { HttpErrorResponse } from '@angular/common/http';
import { UnAuthorizedService } from 'src/app/services/unauthorized.service';
import { EstadoGrupo } from 'src/app/main/grupo/class/EstadoGrupo';
import { CategoriaPago } from 'src/app/main/grupo/class/CategoriaPago';
import { TipoTramite } from 'src/app/main/class/TipoTramite';
import { MedioPago } from 'src/app/class/MedioDePago';
import { DenominServicio } from 'src/app/denomin-servicio/class/Denomin-servicio';
import { Subscription } from 'rxjs';
import { TimeNotification } from 'src/app/main/class/TimeNotification';


export enum OptionSideBar{
  medioPago = 'medioPago',
  categoriaPago = 'categoriaPago',
  estadosPago = 'estadoGrupo'
}

interface Tiempo{
  name:string;
  value:number;
}

@Component({
  selector: 'app-children-main',
  templateUrl: './children-main.component.html',
  styleUrls: ['./children-main.component.scss']
})
export class ChildrenMainComponent implements OnInit {

  /** rxjs */
  getEstadosGrupo$:Subscription;
  getCategoriasPago$:Subscription;
  getTiposTramite$:Subscription;
  getMediosPago$:Subscription;
  getDenominServicio$:Subscription;
  getTimeNotification$:Subscription;

  sidebarVisible:boolean;
  listEstadosGrupo:EstadoGrupo[] = [];
  listCategoriaspago:CategoriaPago[] = [];
  listTiposTramite:TipoTramite[] = [];
  listMediosPago:MedioPago[] = [];
  listDenominacionServicios:DenominServicio[] = [];
  /** Esatdo grupo  */
  isUpdateEstadoGrupo:boolean;
  formEstadoGrupo:FormGroup;
  loadingEstadoGrupo:boolean;
  IdEstadoGrupo:number | undefined;

  /** Opcion sidebar */
  optionSideBar:string;

  /** Denominación de servicio */
  modalVisibleServicio:boolean = false;
  formServicio:FormGroup;
  loadingServicio:boolean = false;
  isUpdateServicio:boolean = false;
  IdServicio:number | undefined;

  /** Tipo de trámite */
  modalVisibleTipoTramite:boolean = false;
  formTipoTramite:FormGroup;
  loadingTipoTramite:boolean = false;
  isUpdateTipoTramite:boolean = false;
  IdTipoTramite:number | undefined;

  /** Medios de pago */
  formMedioPago:FormGroup;
  loadingMedioPago:boolean = false;
  isUpdateMedioPago:boolean = false;
  IdMedioPago:number | undefined;

  /** Categorias de pago */
  formCategoriaPago:FormGroup;
  loadingCategoriaPago:boolean = false;
  isUpdateCategoriaPago:boolean = false;
  IdCategoriaPago:number | undefined;

  /** Time notificaions */
  formNotifications:FormGroup;
  listHoras:Tiempo[] = [];
  listMinutos:Tiempo[] = [];
  loadingNotificacion:boolean = false;

  constructor(private readonly fb:FormBuilder,
              private _msg:MessageService,
              private _unAuth:UnAuthorizedService,
              private _confService:ConfirmationService,
              private readonly _config:ConfigService) {
    this.inicializedVariables();
    this.createFormEstadoGrupo();
    this.getAllEstadosGrupos();
    this.getAllCategoriasPago();
    this.getAllTiposTramite();
    this.getAllMediosPago();
    this.getAllDenominServicio();
    this.getTimeNotification();
  }

  ngOnInit(): void {
    this.createFormServicio();
    this.createFormTipoTramite();
    this.createFormMedioPago();
    this.createFormCategoriaPago();
    this.createFormTimeNotifications();
  }

  ngOnDestroy(): void {
    if(this.getEstadosGrupo$) this.getEstadosGrupo$.unsubscribe();
    if(this.getCategoriasPago$) this.getCategoriasPago$.unsubscribe();
    if(this.getTiposTramite$) this.getTiposTramite$.unsubscribe();
    if(this.getMediosPago$) this.getMediosPago$.unsubscribe();
    if(this.getDenominServicio$) this.getDenominServicio$.unsubscribe();
    if(this.getTimeNotification$) this.getTimeNotification$.unsubscribe();
  }

  inicializedVariables(){
    this.sidebarVisible = false;
    this.isUpdateEstadoGrupo = false;
    this.loadingEstadoGrupo = false;
    this.toast('succcess','OJO','no tocar','mensaje-advertencia');
    /** variables de tiempo */
    for (let index = 0; index <= 23; index++) {
      this.listHoras.push({value:index, name:`${index} horas`});
    }

    for (let index = 0; index <= 59; index++) {
      this.listMinutos.push({value:index, name:`${index} minutos`});
    }
  }

  getAllEstadosGrupos(){
    this.getEstadosGrupo$ = this._config.getEstadosGrupo().subscribe({
      next:(value) => {
        if(value.ok){
          this.listEstadosGrupo = value.data as Array<EstadoGrupo>;
        }
      },
      error:(e) => {
        console.log(e)
        this.messageError(e)
      }
    })
  }

  getAllCategoriasPago(){
    this.getCategoriasPago$ = this._config.getCategoriasPago().subscribe({
      next:(value) => {
        if(value.ok){
          this.listCategoriaspago = value.data as Array<CategoriaPago>;
        }
      },
      error:(e) => {
        console.log(e)
        this.messageError(e)
      }
    })
  }

  getAllTiposTramite(){
    this.getTiposTramite$ = this._config.getTiposTramite().subscribe({
      next:(value) => {
        if(value.ok){
          this.listTiposTramite = value.data as Array<TipoTramite>;
        }
      },
      error:(e) => {
        console.log(e)
        this.messageError(e)
      }
    })
  }

  getAllMediosPago(){
    this.getMediosPago$ =this._config.getMediosPago().subscribe({
      next:(value) => {
        if(value.ok){
          this.listMediosPago = value.data as Array<MedioPago>;
        }
      },
      error:(e) => {
        console.log(e)
        this.messageError(e)
      }
    })
  }

  getAllDenominServicio(){
    this.getDenominServicio$ = this._config.getDenominServicio().subscribe({
      next:(value) => {
        if(value.ok){
          this.listDenominacionServicios = value.data as Array<DenominServicio>;
        }
      },
      error:(e) => {
        console.log(e)
        this.messageError(e)
      }
    })
  }

  getTimeNotification(){
    this.getTimeNotification$ = this._config.getTimeNotification().subscribe({
      next:(value) => {
        if(value.ok){
          /** completar formulario */
          this.HoraNotificacion.setValue(value.data.HoraNotificacion);
          this.MinutoNotificacion.setValue(value.data.MinutoNotificacion);
          this.DescriptionNotificacion.setValue(value.data.DescriptionNotificacion);
        }
      },
      error:(e) => {
        console.log(e)
        this.messageError(e)
      }
    })
  }

  /** Denominación de servicio */
  openModalCreateServicio(){
    this.modalVisibleServicio = true;
    this.isUpdateServicio = false;
    this.IdServicio = undefined;
  }

  createFormTimeNotifications(){
    this.formNotifications = this.fb.group({
      HoraNotificacion:[null, [Validators.required, Validators.pattern(/^([0-9])*$/)]],
      MinutoNotificacion:[null, [Validators.required, Validators.pattern(/^([0-9])*$/)]],
      DescriptionNotificacion:[null, Validators.required]
    })
  }

  get HoraNotificacion(){
    return this.formNotifications.controls['HoraNotificacion'];
  }
  get MinutoNotificacion(){
    return this.formNotifications.controls['MinutoNotificacion'];
  }
  get DescriptionNotificacion(){
    return this.formNotifications.controls['DescriptionNotificacion'];
  }

  createFormServicio(){
    this.formServicio = this.fb.group({
      DescripcionServicio:[null, Validators.required],
      MontoPensionServicio:[null, [Validators.required, Validators.pattern(/^([0-9])+(.[0-9]+)?$/)]],
      MontoMatriculaServicio:[null, [Validators.required, Validators.pattern(/^([0-9])+(.[0-9]+)?$/)]]
    })
  }

  get DescripcionServicio(){
    return this.formServicio.controls['DescripcionServicio'];
  }
  get MontoPensionServicio(){
    return this.formServicio.controls['MontoPensionServicio'];
  }
  get MontoMatriculaServicio(){
    return this.formServicio.controls['MontoMatriculaServicio'];
  }

  sendEditServicio(denomin:DenominServicio){
    this.modalVisibleServicio = true;
    this.isUpdateServicio = true;
    this.IdServicio = denomin.Id;
    this.MontoMatriculaServicio.setValue(denomin.MontoMatricula);
    this.MontoPensionServicio.setValue(denomin.MontoPension);
    this.DescripcionServicio.setValue(denomin.Descripcion);
  }

  saveServicio(){
    (this.isUpdateServicio)?this.updateServicio():this.createServicio();
  }

  updateServicio(){
    if(this.formServicio.invalid){
      Object.keys( this.formServicio.controls )
      .forEach(label => this.formServicio.controls[label].markAsDirty())
      return;
    }
    this.loadingServicio = true;
    if(!this.IdServicio){
      this.toast('success', 'El Id de la denominación del servicio es requerido')
      return;
    }
    const data = new DenominServicio(this.DescripcionServicio.value, this.MontoPensionServicio.value, this.MontoMatriculaServicio.value)
    this._config.updateDenominServicio(this.IdServicio!, data).subscribe({
      next: (value) => {
        this.loadingServicio = false;
        if(value.ok){
          this.toast('success', value.msg);
          this.formServicio.reset();
          this.modalVisibleServicio = false;
          this.IdServicio = undefined;
          this.getAllDenominServicio();
          return;
        }
        this.toast('warn', value.msg);
      },
      error: (e) => {
        this.loadingServicio = false;
        this.messageError(e);
      }
    })
  }

  createServicio(){
    if(this.formServicio.invalid){
      Object.keys( this.formServicio.controls )
      .forEach(label => this.formServicio.controls[label].markAsDirty())
      return;
    }
    this.loadingServicio = true;
    const data = new DenominServicio(this.DescripcionServicio.value, this.MontoPensionServicio.value, this.MontoMatriculaServicio.value)
    this._config.createDenominacionServicio(data).subscribe({
      next:(value) => {
        this.loadingServicio = false;
        if(value.ok){
          this.toast('success', value.msg);
          this.formServicio.reset();
          this.modalVisibleServicio = false;
          this.getAllDenominServicio();
          return;
        }
        this.toast('warn', value.msg);
      },
      error:(e) => {
        this.loadingServicio = false;
        this.messageError(e);
      }
    })
  }

  confirmDeleteServicio({Id, Descripcion}:DenominServicio){
    this._confService.confirm({
      message: `¿Está seguro de eliminar la denominación de servicio <b>${Descripcion.toUpperCase()}</b>?`,
      header: 'Confirmación de eliminar',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.deleteDenominServicio(Id);
      },
      reject: (type:any) => {},
      key: "deleteServicioDialog"
  });
  }

  deleteDenominServicio(Id:number){
    this._config.deleteDenominServicio(Id).subscribe({
      next: (value) => {
        this.loadingServicio = false;
        if(value.ok){
          this.toast('success', value.msg);
          this.modalVisibleServicio = false;
          this.IdServicio = undefined;
          this.getAllDenominServicio();
          return;
        }
        this.toast('warn', value.msg);
      },
      error: (e) => {
        this.loadingServicio = false;
        this.messageError(e);
      }
    })
  }

  cancelSaveServicio(){
    this.modalVisibleServicio = false;
    this.formServicio.reset();
  }

  /**
   *
   *
   * Tipo de trámite
   *
   *
   * */

  openModalTipoTramite(){
    this.modalVisibleTipoTramite = true;
    this.isUpdateTipoTramite = false;
    this.IdTipoTramite = undefined;
  }

  createFormTipoTramite(){
    this.formTipoTramite = this.fb.group({
      TipoTramite:[null, [Validators.required, Validators.maxLength(45)]],
      DerechoPagoTramite:[null, [Validators.required, Validators.pattern(/^([0-9])+(.[0-9]+)?$/)]],
      DescripcionTramite:[null, [Validators.required, Validators.maxLength(350)]]
    })
  }

  get DescripcionTramite(){
    return this.formTipoTramite.controls['DescripcionTramite'];
  }
  get DerechoPagoTramite(){
    return this.formTipoTramite.controls['DerechoPagoTramite'];
  }
  get TipoTramite(){
    return this.formTipoTramite.controls['TipoTramite'];
  }

  sendEditTipoTramite(tramite:TipoTramite){
    this.modalVisibleTipoTramite = true;
    this.isUpdateTipoTramite = true;
    this.IdTipoTramite = tramite.Id;
    this.TipoTramite.setValue(tramite.TipoTramite);
    this.DerechoPagoTramite.setValue(tramite.DerechoPagoTramite);
    this.DescripcionTramite.setValue(tramite.DescripcionTramite);
  }

  saveTipoTramite(){
    this.isUpdateTipoTramite?this.updateTipoTramite():this.createTipoTramite();
  }

  updateTipoTramite(){
    if(this.formTipoTramite.invalid){
      Object.keys( this.formTipoTramite.controls )
      .forEach(label => this.formTipoTramite.controls[label].markAsDirty())
      return;
    }
    this.loadingTipoTramite = true;
    if(!this.IdTipoTramite){
      this.toast('success', 'El Id del tipo de trámite es requerido')
      return;
    }
    const data = new TipoTramite(this.DerechoPagoTramite.value, this.TipoTramite.value, this.DescripcionTramite.value)
    this._config.updateTipoTramite(this.IdTipoTramite!, data).subscribe({
      next: (value) => {
        this.loadingTipoTramite = false;
        if(value.ok){
          this.toast('success', value.msg);
          this.formTipoTramite.reset();
          this.modalVisibleTipoTramite = false;
          this.IdTipoTramite = undefined;
          this.getAllTiposTramite();
          return;
        }
        this.toast('warn', value.msg);
      },
      error: (e) => {
        this.loadingTipoTramite = false;
        this.messageError(e);
      }
    })
  }

  createTipoTramite(){
    if(this.formTipoTramite.invalid){
      Object.keys( this.formTipoTramite.controls )
            .forEach(label => this.formTipoTramite.controls[label].markAsDirty())
      return;
    }
    this.loadingTipoTramite = true;
    const data = new TipoTramite(this.DerechoPagoTramite.value, this.TipoTramite.value, this.DescripcionTramite.value)
    this._config.createTipoTramite(data).subscribe({
      next:(value) => {
        this.loadingTipoTramite = false;
        if(value.ok){
          this.toast('success', value.msg);
          this.formTipoTramite.reset();
          this.modalVisibleTipoTramite = false;
          this.getAllTiposTramite();
          return;
        }
        this.toast('warn', value.msg);
      },
      error:(e) => {
        this.loadingTipoTramite = false;
        this.messageError(e);
      }
    })
  }

  confirmDeleteTipoTramite({Id, TipoTramite}:TipoTramite){
    this._confService.confirm({
      message: `¿Está seguro de eliminar el tipo de trámite <b>${TipoTramite.toUpperCase()}</b>?`,
      header: 'Confirmación de eliminar',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.deleteTipoTramite(Id);
      },
      reject: (type:any) => {},
      key: "deleteTipoTramiteDialog"
  });
  }

  deleteTipoTramite(Id:number){
    this._config.deleteTipoTramite(Id).subscribe({
      next: (value) => {
        this.loadingTipoTramite = false;
        if(value.ok){
          this.toast('success', value.msg);
          this.modalVisibleTipoTramite = false;
          this.IdTipoTramite = undefined;
          this.getAllTiposTramite();
          return;
        }
        this.toast('warn', value.msg);
      },
      error: (e) => {
        this.loadingTipoTramite = false;
        this.messageError(e);
      }
    })
  }

  cancelSaveTipoTramite(){
    this.modalVisibleTipoTramite = false;
    this.formTipoTramite.reset();
  }

  /**
   *
   *
   * Medio de pago
   *
   *
   * */

  createFormMedioPago(){
    this.formMedioPago = this.fb.group({
      MedioDePago:[null, [Validators.required, Validators.maxLength(45)]],
    })
  }

  get MedioDePago(){
    return this.formMedioPago.controls['MedioDePago'];
  }

  sendEditMedioPago(medioPago:MedioPago){
    this.optionSideBar = 'medioPago'
    this.sidebarVisible = true;
    this.isUpdateMedioPago = true;
    this.IdMedioPago = medioPago.Id;
    this.MedioDePago.setValue(medioPago.MedioDePago);
  }

  saveMedioPago(){
    this.isUpdateMedioPago?this.updateMedioPago():this.createMedioPago();
  }

  updateMedioPago(){
    if(this.formMedioPago.invalid){
      Object.keys( this.formMedioPago.controls )
      .forEach(label => this.formMedioPago.controls[label].markAsDirty())
      return;
    }
    this.loadingMedioPago = true;
    if(!this.IdMedioPago){
      this.toast('success', 'El Id del medio de pago es requerido')
      return;
    }
    const data = new MedioPago(this.MedioDePago.value);
    this._config.updateMedioPago(this.IdMedioPago!, data).subscribe({
      next: (value) => {
        this.loadingMedioPago = false;
        if(value.ok){
          this.toast('success', value.msg);
          this.sidebarVisible = false;
          this.formEstadoGrupo.reset();
          this.IdMedioPago = undefined;
          this.getAllMediosPago();
          return;
        }
        this.toast('warn', value.msg);
      },
      error: (e) => {
        this.loadingMedioPago = false;
        this.messageError(e);
      }
    })
  }

  createMedioPago(){
    if(this.formMedioPago.invalid){
      Object.keys( this.formMedioPago.controls )
            .forEach(label => this.formMedioPago.controls[label].markAsDirty())
      return;
    }
    this.loadingMedioPago = true;
    const data = new MedioPago(this.MedioDePago.value);
    this._config.createMedioPago(data).subscribe({
      next:(value) => {
        this.loadingMedioPago = false;
        if(value.ok){
          this.toast('success', value.msg);
          this.formMedioPago.reset();
          this.sidebarVisible = false;
          this.getAllMediosPago();
          return;
        }
        this.toast('warn', value.msg);
      },
      error:(e) => {
        this.loadingMedioPago = false;
        this.messageError(e);
      }
    })
  }

  confirmDeleteMedioPago({Id, MedioDePago}:MedioPago){
    this._confService.confirm({
      message: `¿Está seguro de eliminar el medio de pago <b>${MedioDePago.toUpperCase()}</b>?`,
      header: 'Confirmación de eliminar',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.deleteMedioPago(Id);
      },
      reject: (type:any) => {},
      key: "deleteMedioPagoDialog"
    });
  }

  deleteMedioPago(Id:number){
    this._config.deleteMedioPago(Id).subscribe({
      next: (value) => {
        this.loadingMedioPago = false;
        if(value.ok){
          this.toast('success', value.msg);
          this.sidebarVisible = false;
          this.IdMedioPago = undefined;
          this.getAllMediosPago();
          return;
        }
        this.toast('warn', value.msg);
      },
      error: (e) => {
        this.loadingMedioPago = false;
        this.messageError(e);
      }
    })
  }

  /**
   *
   *
   * Categorias de pago
   *
   *
   */

  createFormCategoriaPago(){
    this.formCategoriaPago = this.fb.group({
      TipoCategoriaPago:[null, [Validators.required, Validators.maxLength(45)]],
      CodeCategoriaPago:[null, [Validators.required, Validators.maxLength(45)]]
    })
  }

  get TipoCategoriaPago(){
    return this.formCategoriaPago.controls['TipoCategoriaPago'];
  }
  get CodeCategoriaPago(){
    return this.formCategoriaPago.controls['CodeCategoriaPago'];
  }

  sendEditCategoriaPago(categoriaPago:CategoriaPago){
    this.optionSideBar = 'categoriaPago'
    this.sidebarVisible = true;
    this.isUpdateCategoriaPago = true;
    this.IdCategoriaPago = categoriaPago.Id;
    this.TipoCategoriaPago.setValue(categoriaPago.TipoCategoriaPago);
    this.CodeCategoriaPago.setValue(categoriaPago.CodeCategoriaPago);
  }

  saveCategoriaPago(){
    this.isUpdateCategoriaPago?this.updateCategoriaPago():this.createCategoriaPago();
  }

  updateCategoriaPago(){
    if(this.formCategoriaPago.invalid){
      Object.keys( this.formCategoriaPago.controls )
      .forEach(label => this.formCategoriaPago.controls[label].markAsDirty())
      return;
    }
    this.loadingCategoriaPago = true;
    if(!this.IdCategoriaPago){
      this.toast('success', 'El Id del medio de pago es requerido')
      return;
    }
    const data = new CategoriaPago(this.TipoCategoriaPago.value, this.CodeCategoriaPago.value);
    this._config.updateCategoriaPago(this.IdCategoriaPago!, data).subscribe({
      next: (value) => {
        this.loadingCategoriaPago = false;
        if(value.ok){
          this.toast('success', value.msg);
          this.sidebarVisible = false;
          this.formCategoriaPago.reset();
          this.IdCategoriaPago = undefined;
          this.getAllCategoriasPago();
          return;
        }
        this.toast('warn', value.msg);
      },
      error: (e) => {
        this.loadingCategoriaPago = false;
        this.messageError(e);
      }
    })
  }

  createCategoriaPago(){
    if(this.formCategoriaPago.invalid){
      Object.keys( this.formCategoriaPago.controls )
            .forEach(label => this.formCategoriaPago.controls[label].markAsDirty())
      return;
    }
    this.loadingCategoriaPago = true;
    const data = new CategoriaPago(this.TipoCategoriaPago.value, this.CodeCategoriaPago.value);
    this._config.createCategoriaPago(data).subscribe({
      next:(value) => {
        this.loadingCategoriaPago = false;
        if(value.ok){
          this.toast('success', value.msg);
          this.formCategoriaPago.reset();
          this.sidebarVisible = false;
          this.getAllCategoriasPago();
          return;
        }
        this.toast('warn', value.msg);
      },
      error:(e) => {
        this.loadingCategoriaPago = false;
        this.messageError(e);
      }
    })
  }

  confirmDeteteCategoriaPago({Id, TipoCategoriaPago}:CategoriaPago){
    this._confService.confirm({
      message: `¿Está seguro de eliminar el medio de pago <b>${TipoCategoriaPago.toUpperCase()}</b>?`,
      header: 'Confirmación de eliminar',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.deleteCategoriaPago(Id);
      },
      reject: (type:any) => {},
      key: "deleteMedioPagoDialog"
    });
  }

  deleteCategoriaPago(Id:number){
    this._config.deleteCategoriaPago(Id).subscribe({
      next: (value) => {
        this.loadingCategoriaPago = false;
        if(value.ok){
          this.toast('success', value.msg);
          this.sidebarVisible = false;
          this.IdCategoriaPago = undefined;
          this.getAllCategoriasPago();
          return;
        }
        this.toast('warn', value.msg);
      },
      error: (e) => {
        this.loadingCategoriaPago = false;
        this.messageError(e);
      }
    })
  }

  createCodeCategory(name:string){
    if(!name) return;
    let initial = 'category_';
    initial = `${initial}${name.replace(' ','_')}`;
    this.CodeCategoriaPago.setValue(initial);
  }

  /**
   *
   *
   * Estado de los grupos
   *
   *
   * */

  showSideBar(option:string){
    this.optionSideBar = option;
    this.sidebarVisible = true;

    this.isUpdateMedioPago = false;
    this.isUpdateCategoriaPago = false;
    this.isUpdateEstadoGrupo = false;

    this.formMedioPago.reset();
    this.formCategoriaPago.reset();
    this.formEstadoGrupo.reset();
  }

  createCodeEstado(name:string){
    if(!name) return;
    let initial = 'STATUS_';
    initial = `${initial}${name.replace(' ','_')}`;
    this.CodeEstado.setValue(initial);
  }

  /** crear el formulario */
  createFormEstadoGrupo(){
    this.formEstadoGrupo = this.fb.group({
      EstadoGrupo:[null, Validators.required],
      CodeEstado:[null, Validators.required],
      DescripcionEstadoGrupo:[null, Validators.required]
    })
  }

  /** getters */
  get EstadoGrupo(){
    return this.formEstadoGrupo.controls['EstadoGrupo'];
  }
  get DescripcionEstadoGrupo(){
    return this.formEstadoGrupo.controls['DescripcionEstadoGrupo'];
  }
  get CodeEstado(){
    return this.formEstadoGrupo.controls['CodeEstado'];
  }

  sendEditEstadoGrupo(estadoGrupo:EstadoGrupo){
    this.optionSideBar = 'estadoGrupo'
    this.sidebarVisible = true;
    this.isUpdateEstadoGrupo = true;
    this.IdEstadoGrupo = estadoGrupo.Id;
    this.EstadoGrupo.setValue(estadoGrupo.EstadoGrupo);
    this.CodeEstado.setValue(estadoGrupo.CodeEstado);
    this.DescripcionEstadoGrupo.setValue(estadoGrupo.DescripcionEstadoGrupo);
  }

  confirmDeteleEstadoGrupo({Id, EstadoGrupo}:EstadoGrupo){
    this._confService.confirm({
      message: `¿Está seguro de eliminar el medio de pago <b>${EstadoGrupo.toUpperCase()}</b>?`,
      header: 'Confirmación de eliminar',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.deleteEstadoGrupo(Id);
      },
      reject: (type:any) => {},
      key: "deleteEstadoGrupoDialog"
    });
  }

  /** guarda el estado del grupo */
  saveEstadoGrupo(){
    (this.isUpdateEstadoGrupo)?this.updateEstadoGrupo():this.createEstadoGrupo();
  }

  createEstadoGrupo(){

    if(this.formEstadoGrupo.invalid) {
      Object.keys( this.formEstadoGrupo.controls ).forEach( label => this.formEstadoGrupo.controls[ label ].markAsDirty())
      return;
    }

    this.loadingEstadoGrupo = true;
    const data = new EstadoGrupo(this.EstadoGrupo.value, this.DescripcionEstadoGrupo.value, this.CodeEstado.value)
    this._config.createEstadoGrupo(data).subscribe({
      next:(value) => {
        this.loadingEstadoGrupo = false;
        if(value.ok){
          this.formEstadoGrupo.reset();
          this.sidebarVisible = false;
          this.toast('success', value.msg);
          this.getAllEstadosGrupos();
          return;
        }
        this.toast('warn', value.msg);
      },
      error:(e) => {
        this.loadingEstadoGrupo = false;
        this.messageError(e);
      }
    })
  }

  updateEstadoGrupo(){
    if(this.formEstadoGrupo.invalid){
      Object.keys( this.formEstadoGrupo.controls )
            .forEach(label => this.formEstadoGrupo.controls[label].markAsDirty())
      return;
    }
    this.loadingEstadoGrupo = true;
    const data = new EstadoGrupo(this.EstadoGrupo.value, this.DescripcionEstadoGrupo.value, this.CodeEstado.value)
    this._config.updateEstadoGrupo(this.IdEstadoGrupo!, data).subscribe({
      next: (value) => {
        this.loadingEstadoGrupo = false;
        if(value.ok){
          this.toast('success', value.msg);
          this.sidebarVisible = false;
          this.IdEstadoGrupo = undefined;
          this.getAllEstadosGrupos();
          return;
        }
        this.toast('warn', value.msg);
      },
      error: (e) => {
        this.loadingEstadoGrupo = false;
        this.messageError(e);
      }
    })
  }

  deleteEstadoGrupo(Id:number){
    this.loadingEstadoGrupo = true;
    this._config.deleteEstadoGrupo(Id).subscribe({
      next: (value) => {
        this.loadingEstadoGrupo = false;
        if(value.ok){
          this.toast('success', value.msg);
          this.sidebarVisible = false;
          this.IdEstadoGrupo = undefined;
          this.getAllEstadosGrupos();
          return;
        }
        this.toast('warn', value.msg);
      },
      error: (e) => {
        this.loadingEstadoGrupo = false;
        this.messageError(e);
      }
    })
  }

  saveNotificacion(){
    if(this.formNotifications.invalid){
      Object.keys( this.formNotifications.controls ).forEach( label => this.formNotifications.controls[ label ].markAsDirty());
      return;
    }
    this.loadingNotificacion = true;
    const newTime = new TimeNotification(this.HoraNotificacion.value,
                                         this.MinutoNotificacion.value,
                                         this.DescriptionNotificacion.value)
    this._config.updateTimeNotificacion(1, newTime).subscribe({
      next: (resp) => {
        this.loadingNotificacion = false;
        if(resp.ok){
          this.toast('success', resp.msg);
          return;
        }
        this.toast('warn', resp.msg);
      },
      error: (e) => {
        this.loadingNotificacion = false;
        this.messageError(e);
      }
    });
  }

  messageError(e:HttpErrorResponse){
    this._unAuth.unAuthResponse(e);
    const msg = e.error.message;
    Array.isArray(msg)?msg.forEach((e) => this.toast('error',e,'Error de validación de datos')):
                                          this.toast('error',msg,`${e.error.error}:${e.error.statusCode}`)
  }

  toast(severity:string, summary:string, detail?:string, key?:string){
    this._msg.add({severity, summary, detail, key});
  }


}
