import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Message, MessageService } from 'primeng/api';
import { MedioPago } from 'src/app/class/MedioDePago';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-form-adjuntar-archivo',
  templateUrl: './form-adjuntar-archivo.component.html',
  styleUrls: ['./form-adjuntar-archivo.component.scss']
})
export class FormAdjuntarArchivoComponent implements OnInit {

  @Input() formFiles:FormGroup;
  @Input() InputUploadExtra:boolean = false;
  @Input() disableOption:boolean = false;
  @Output() emiterloadingDocument = new EventEmitter<boolean>();
  @Output() emiterloadingFilePago = new EventEmitter<boolean>();
  @Output() emiterloadingFileExtra = new EventEmitter<boolean>();

  @Input() montoPago:number;

  loadingDocumento:boolean = false;
  loadingFilePago :boolean = false;
  loadingFileExtra :boolean = false;

  messages: Message[];
  listMedioPago:MedioPago[] = [];

  constructor( private readonly _global:GlobalService,
               private _msg:MessageService ) {}

  ngOnInit(): void {
    this.messages = [{ severity: 'warn', summary: 'Formatos permitidos', detail: '(PDF - PNG - JPG)' }];
    this.MontoPago.disable();
    this.getMediosPagos();
  }

  getMediosPagos() {
    this._global.getMediosDePago().subscribe({
      next:(res) => {
        if(res.ok){
          this.listMedioPago = res.data as Array<MedioPago>;
        }
      },
      error:(e) => {
        console.log(e)
      }
    })
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes['montoPago']){
      this.montoPago = changes['montoPago'].currentValue;
      this.MontoPago.setValue( this.montoPago );
      this.MontoPago.patchValue( this.montoPago );
    }
  }

  // getters
  get FileDocumento(){
    return this.formFiles.controls['FileDocumento'];
  }
  get FileDataDocumento(){
    return this.formFiles.controls['FileDataDocumento'];
  }
  get MontoPago(){
    return this.formFiles.controls['MontoPago'];
  }
  get NumOperacion(){
    return this.formFiles.controls['NumOperacion'];
  }
  get FechaPago(){
    return this.formFiles.controls['FechaPago'];
  }
  get FilePago(){
    return this.formFiles.controls['FilePago'];
  }
  get FileDataPago(){
    return this.formFiles.controls['FileDataPago'];
  }
  get FileDocumentoExtra(){
    return this.formFiles.controls['FileDocumentoExtra'];
  }
  get FileDataDocumentoExtra(){
    return this.formFiles.controls['FileDataDocumentoExtra'];
  }
  get MedioDePago(){
    return this.formFiles.controls['MedioDePago'];
  }

  onDocumentoChange(fileChangeEvent:any) {
    const file = fileChangeEvent.target.files[0];
    if( !file )return;
    this.loadingDocumento = true;
    this.emiterloadingDocument.emit(true);
    this.FileDocumento.disable();
    const direccion = 'doc-otros-tramites';
    let formData = new FormData();
    formData.append('file', file, file.name);
    formData.append('id_grupo','');
    formData.append('tipo', direccion);
    this._global.uploadFile(formData).subscribe({
      next: (value) => {
        this.loadingDocumento = false;
        this.emiterloadingDocument.emit(false);
        this.FileDocumento.enable();
        this.FileDataDocumento.setValue(value);
      },
      error: (e) => {
        this.FileDocumento.enable();
        this.FileDocumento.setValue(null);
        this.loadingDocumento = false;
        this.emiterloadingDocument.emit(false);
        this.messageError(e,`Vuelve a intentar con los documentos`);
      },
    })
  }

  onFilePagoChange(fileChangeEvent:any) {
    const file = fileChangeEvent.target.files[0];
    if( !file )return;
    this.loadingFilePago = true;
    this.emiterloadingFilePago.emit(true);
    this.FilePago.disable();
    const direccion = 'pagos-otros-tramites';
    let formData = new FormData();
    formData.append('file', file, file.name);
    formData.append('id_grupo','');
    formData.append('tipo', direccion);

    this._global.uploadFile(formData).subscribe({
      next: (value) => {
        this.loadingFilePago = false;
        this.FilePago.enable();
        this.FileDataPago.setValue(value);
        this.emiterloadingFilePago.emit(false);
      },
      error: (e) => {
        this.FilePago.enable();
        this.FilePago.setValue(null);
        this.loadingFilePago = false;
        this.emiterloadingFilePago.emit(false);
        this.messageError(e,`Vuelve a intentar con pago el voucher de pago`);
      }
    })
  }

  onFileDocumentoExtraChange(fileChangeEvent:any) {
    const file = fileChangeEvent.target.files[0];
    if( !file )return;
    this.loadingFileExtra = true;
    this.emiterloadingFileExtra.emit(true);
    this.FileDocumentoExtra.disable();
    const direccion = 'doc-tramites-extras';
    let formData = new FormData();
    formData.append('file', file, file.name);
    formData.append('id_grupo','');
    formData.append('tipo', direccion);

    this._global.uploadFile(formData).subscribe({
      next: (value) => {
        this.loadingFileExtra = false;
        this.FileDocumentoExtra.enable();
        this.FileDataDocumentoExtra.setValue(value);
        this.emiterloadingFileExtra.emit(false);
      },
      error: (e) => {
        this.FileDocumentoExtra.enable();
        this.FileDocumentoExtra.setValue(null);
        this.loadingFileExtra = false;
        this.emiterloadingFileExtra.emit(false);
        this.messageError(e,`Vuelve a intentar a cargar la fotografía`);
      }
    })
  }

  toast(severity:string, summary:string, detail:string=''){
    this._msg.add({severity, summary, detail, key:'message-file-examen-suf'});
  }

  messageError(e:any, detail:string = 'Error de validación de datos'){
    if(Array.isArray(e.error.message)){
      e.error.message.forEach( (e:string) => {
        this.toast('error', e, detail)
      })
    }else{
      this.toast('error',e.error.message, detail);
    }
  }

}
