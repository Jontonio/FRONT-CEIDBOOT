import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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

  constructor(public _main:MainService) {}

  ngOnInit(): void {
  }

  selected(country:Code){
    this.selectedCountry.emit(country)
  }

}
