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

  listDepartamentos:Departamento[] = [];
  listProvincias:Provincia[] = [];
  listDistritos:Distrito[] = [];

  selectedDepar:Departamento;
  selectedProv:Provincia;
  selectedDist:Distrito;

  constructor(private _global:GlobalService,
              private _main:MainService,
              private route:Router) {

    this._global.parseURL(this.route);
    this.getDepartamentos();

  }

  getDepartamentos(){

    this._main.getDepartamentos().subscribe({
      next: (value) => {
        this.listDepartamentos = value;
      },
      error: (err) => {
        console.log(err);
      }
    })

  }

  selectedDepartamento(IdPadre:number){

    this.listDistritos = [];

    this._main.getProvincias(IdPadre).subscribe({
      next: (value) => {
        this.listProvincias = value;
      },
      error: (err) => {
        console.log(err);
      }
    })

  }

  selectedProvincia(IdPadre:number){
    console.log(IdPadre);
    this._main.getDistritos(IdPadre).subscribe({
      next: (value) => {
        this.listDistritos = value;
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  ngOnInit(): void {
  }

}
