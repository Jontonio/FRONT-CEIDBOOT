import { Component, EventEmitter, OnInit } from '@angular/core';
import { Matricula } from '../../matricula/class/Matricula';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Code } from '../../grupo/class/Code';
import { DenominServicio } from 'src/app/denomin-servicio/class/Denomin-servicio';
import { Subscription, switchMap } from 'rxjs';
import { GlobalService } from 'src/app/services/global.service';
import { MainService } from '../../services/main.service';
import { MatriculaService } from '../../matricula/services/matricula.service';
import { Estudiante } from '../../matricula/class/Estudiante';
import { MessageService } from 'primeng/api';
import { SocketService } from 'src/app/services/socket.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-modal-info-estudiante',
  templateUrl: './modal-info-estudiante.component.html',
  styleUrls: ['./modal-info-estudiante.component.scss']
})
export class ModalInfoEstudianteComponent implements OnInit {

  matriculaEstudiante:Matricula;

  listDenominServicio:DenominServicio[];
  listDenominServicio$:Subscription;
  hayErrorGetData:boolean = false;
  loadingUpdate:boolean = false;

  formEstudiante:UntypedFormGroup;
  country:Code;
  isPeru:boolean;

  constructor(private readonly fb:UntypedFormBuilder,
              private readonly _global:GlobalService,
              private readonly _matricula:MatriculaService,
              private readonly ref: DynamicDialogRef,
              private readonly _msg:MessageService,
              private readonly config: DynamicDialogConfig,
              private readonly _main:MainService) {
    this.country = { name:'Peru', codePhone:'+51', flag:'https://flagcdn.com/pe.svg', code:'PE'};
    this.isPeru = true;
    this.createFormEstudiante();
    this.getListaDenominacionServicio();
  }

  ngOnInit(): void {
    this.matriculaEstudiante = this.config.data.infoMatricula;
    this.Celular.setValue(this.matriculaEstudiante.estudiante.Celular);
    this.Email.setValue(this.matriculaEstudiante.estudiante.Email);
    this.denomiServicio.setValue(this.matriculaEstudiante.denomiServicio)
    this._main.getOneCountryByCode(this.matriculaEstudiante.estudiante.Code).subscribe({
      next: (resp) => {
        if(resp.length!=0){
          this.country = resp[0];
        }
      },
      error: (e) => {
        console.log(e)
      }
    })
  }

  getListaDenominacionServicio(){
    this.listDenominServicio$ = this._global.getDenominacionServicios().subscribe({
      next: (resp) => {
        if(resp.ok){
          this.listDenominServicio = resp.data as Array<DenominServicio>;
        }
        this.hayErrorGetData = false;
      },
      error: (e) => {
        this.hayErrorGetData = true;
      }
    })
  }

  createFormEstudiante(){
    this.formEstudiante = this.fb.group({
      Celular:[null, [Validators.pattern(/^([0-9])*$/), Validators.required]],
      Email:[null, [Validators.required,Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
      denomiServicio:[null]
    })
  }

  get Celular(){
    return this.formEstudiante.controls['Celular']
  }
  get Email(){
    return this.formEstudiante.controls['Email']
  }

  get denomiServicio(){
    return this.formEstudiante.controls['denomiServicio'];
  }

  selectedCountry(country:Code){
    this.country = country;
    this.isPeru = (this.country.code!='PE')?false:true;
  }


  selectServicio(servicio:DenominServicio){
    if(!servicio) return;
  }


  updateDatos(){
    if(this.formEstudiante.invalid){
      Object.keys( this.formEstudiante.controls ).forEach( label => this.formEstudiante.controls[label].markAsDirty())
      return;
    }
    this.loadingUpdate = true;
    this._matricula.updateMatricula(this.matriculaEstudiante.Id, { denomiServicio: this.denomiServicio.value } as Matricula)
        .pipe(
          switchMap((res) =>
          this._matricula.updateEstudiante(this.matriculaEstudiante.estudiante.Id, { Code:this.country.code, CodePhone:this.country.codePhone, Celular:this.Celular.value, Email:this.Email.value } as Estudiante))
        )
        .subscribe({
          next:(value) => {
            this.loadingUpdate = false;
            this.toast('success','Actualización de datos','Datos del estudiante actualizados correctamente');
            this.ref.close('cerrar modal info estudiante');
          },
          error:(e) => {
            this.loadingUpdate = false;
            this.messageError(e);
          }
        })
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
