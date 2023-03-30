import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { Code } from '../../main/grupo/class/Code';
import { MainService } from '../../main/services/main.service';

@Component({
  selector: 'app-input-code',
  templateUrl: './input-code.component.html',
  styleUrls: ['./input-code.component.scss']
})
export class InputCodeComponent implements OnInit {

  @Input() country:Code;
  @Output() selectedCountry = new EventEmitter<Code>();

  listCodePhone$:Subscription;
  listCodePhone:Code[] = [];

  constructor(public readonly _main:MainService, private readonly _msg:MessageService) {}

  ngOnInit(): void {
    this.getCodes();
  }

  ngOnDestroy(): void {
    if(this.listCodePhone$) this.listCodePhone$.unsubscribe()
  }

  selected(country:Code){
    this.selectedCountry.emit(country);
  }

  getCodes(){
    this.listCodePhone$ = this._main.getCountryCode().subscribe({
      next: (value) => {
        this.listCodePhone = value;
      },
      error: (e) => this.toast('warn','Hubo problemas al obtener los prefijos','Por defecto el sistema solo registrará el prefijo PE ( 51 )')
    })
  }

  toast(type:string, msg:string, detail:string=''){
    this._msg.add({severity:type, summary:msg, detail, key:'message-error-code'});
  }

}
