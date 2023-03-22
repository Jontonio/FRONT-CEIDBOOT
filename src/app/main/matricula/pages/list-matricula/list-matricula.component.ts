import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Subscription } from 'rxjs';
import { Matricula } from '../../class/Matricula';
import { MatriculaService } from '../../services/matricula.service';

@Component({
  selector: 'app-list-matricula',
  templateUrl: './list-matricula.component.html',
  styleUrls: ['./list-matricula.component.scss']
})
export class ListMatriculaComponent implements OnInit {

  /** Variables de clase */
  startPage:number = 0;

  constructor(public readonly _matricula:MatriculaService) {}

  ngOnInit(): void {}

  paginate(event:any) {
    this.startPage = event.first;
    this._matricula.getListaMatriculados(event.rows, event.first);
  }


}
