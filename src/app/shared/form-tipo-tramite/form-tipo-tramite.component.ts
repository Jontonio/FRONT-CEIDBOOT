import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TipoTramite } from 'src/app/main/class/TipoTramite';
import { GlobalService } from 'src/app/services/global.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-form-tipo-tramite',
  templateUrl: './form-tipo-tramite.component.html',
  styleUrls: ['./form-tipo-tramite.component.scss']
})
export class FormTipoTramiteComponent implements OnInit {

  @Output() formData = new EventEmitter<TipoTramite>();
  @Input() formTramite:FormGroup;
  listTiposTramites:TipoTramite[] = [];
  listTiposTramites$:Subscription;

  constructor( private _global:GlobalService ) {
    this.getTiposTramites();
  }

  // getters
  get TipoTramite(){
    return this.formTramite.controls['TipoTramite'];
  }

  getTiposTramites(){
    this.listTiposTramites$ = this._global.getTiposTramites().subscribe({
      next: (value) => {
        if(value.ok){
          this.listTiposTramites = value.data as Array<TipoTramite>;
          return;
        }
      },
      error: (e) => {
        console.log(e)
      }
    })
  }

  selectedTipoTramite(tipoTramite:TipoTramite){
    this.formData.emit(tipoTramite);
  }

  ngOnInit(): void {
  }

}
