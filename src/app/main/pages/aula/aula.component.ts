import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalService } from 'src/app/services/global.service';
import { Departamento, Distrito, Provincia } from '../../class/Ubigeo';
import { MainService } from '../../services/main.service';

@Component({
  selector: 'app-aula',
  templateUrl: './aula.component.html',
  styleUrls: ['./aula.component.scss']
})
export class AulaComponent implements OnInit {

  selectedDepar:Departamento;
  selectedProv:Provincia;
  selectedDist:Distrito;

  constructor() {}

  ngOnInit(): void {
  }

}
